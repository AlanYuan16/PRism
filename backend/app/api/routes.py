from fastapi import APIRouter, Depends, HTTPException, Request, BackgroundTasks
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.core.database import get_db
from app.models.models import Repo, PullRequest, Issue, Severity
from app.services.reviewer import review_diff
from app.services.github import verify_webhook_signature, fetch_pr_diff

router = APIRouter()


# ── Pydantic schemas for request/response ──────────────────────────────────

class ManualReviewRequest(BaseModel):
    diff: str
    repo: str = "manual"
    pr_number: int = 0
    title: str = "Manual Review"
    author: str = "unknown"


class IssueResponse(BaseModel):
    id: str
    severity: str
    file_path: str
    line_number: int | None
    category: str | None
    description: str
    suggestion: str | None

    class Config:
        from_attributes = True


class ReviewResponse(BaseModel):
    pull_request_id: str
    summary: str
    issues: list[IssueResponse]
    total_issues: int
    critical_count: int
    warning_count: int
    nitpick_count: int


# ── Helper ──────────────────────────────────────────────────────────────────

def save_review(db: Session, repo_name: str, pr_number: int, title: str,
                author: str, review_result: dict) -> PullRequest:
    """Persist a review and its issues to the database."""

    # Upsert repo
    repo = db.query(Repo).filter(Repo.github_repo == repo_name).first()
    if not repo:
        repo = Repo(github_repo=repo_name)
        db.add(repo)
        db.flush()

    # Create PR record
    pr = PullRequest(
        repo_id=repo.id,
        pr_number=pr_number,
        title=title,
        author=author,
    )
    db.add(pr)
    db.flush()

    # Create issue records
    for issue_data in review_result.get("issues", []):
        issue = Issue(
            pull_request_id=pr.id,
            severity=Severity(issue_data.get("severity", "nitpick")),
            file_path=issue_data.get("file_path", "unknown"),
            line_number=issue_data.get("line_number"),
            category=issue_data.get("category"),
            description=issue_data.get("description", ""),
            suggestion=issue_data.get("suggestion"),
        )
        db.add(issue)

    db.commit()
    db.refresh(pr)
    return pr


def build_review_response(pr: PullRequest) -> ReviewResponse:
    issues = pr.issues
    return ReviewResponse(
        pull_request_id=pr.id,
        summary="Review complete.",
        issues=[IssueResponse.from_orm(i) for i in issues],
        total_issues=len(issues),
        critical_count=sum(1 for i in issues if i.severity == Severity.critical),
        warning_count=sum(1 for i in issues if i.severity == Severity.warning),
        nitpick_count=sum(1 for i in issues if i.severity == Severity.nitpick),
    )


# ── Routes ──────────────────────────────────────────────────────────────────

@router.post("/review", response_model=ReviewResponse)
async def manual_review(request: ManualReviewRequest, db: Session = Depends(get_db)):
    """
    Manually submit a diff for review.
    This is how the CLI tool and the web UI submit reviews.
    """
    if not request.diff.strip():
        raise HTTPException(status_code=400, detail="Diff cannot be empty")

    review_result = review_diff(request.diff)
    pr = save_review(
        db,
        repo_name=request.repo,
        pr_number=request.pr_number,
        title=request.title,
        author=request.author,
        review_result=review_result,
    )
    response = build_review_response(pr)
    response.summary = review_result.get("summary", "")
    return response


@router.post("/webhook/github")
async def github_webhook(
    request: Request,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    """
    Receives GitHub PR webhook events and triggers a review.
    Set this URL in your GitHub repo → Settings → Webhooks.
    """
    payload = await request.body()
    signature = request.headers.get("X-Hub-Signature-256", "")

    if not verify_webhook_signature(payload, signature):
        raise HTTPException(status_code=401, detail="Invalid webhook signature")

    event = request.headers.get("X-GitHub-Event")
    if event != "pull_request":
        return {"status": "ignored", "reason": f"event type '{event}' not handled"}

    body = await request.json()
    action = body.get("action")

    # Only review on opened or synchronize (new commits pushed to PR)
    if action not in ("opened", "synchronize"):
        return {"status": "ignored", "reason": f"action '{action}' not handled"}

    pr_data = body["pull_request"]
    repo_name = body["repository"]["full_name"]
    pr_number = pr_data["number"]

    # Fetch diff and run review in background so GitHub doesn't time out
    async def run_review():
        raw_diff = await fetch_pr_diff(repo_name, pr_number)
        review_result = review_diff(raw_diff)
        save_review(
            db,
            repo_name=repo_name,
            pr_number=pr_number,
            title=pr_data.get("title", ""),
            author=pr_data["user"]["login"],
            review_result=review_result,
        )

    background_tasks.add_task(run_review)
    return {"status": "accepted", "message": "Review queued"}


@router.get("/reviews")
def list_reviews(db: Session = Depends(get_db)):
    """Return all PRs with their issue counts for the dashboard."""
    prs = db.query(PullRequest).order_by(PullRequest.reviewed_at.desc()).limit(50).all()
    return [
        {
            "id": pr.id,
            "repo": pr.repo.github_repo,
            "pr_number": pr.pr_number,
            "title": pr.title,
            "author": pr.author,
            "reviewed_at": pr.reviewed_at,
            "total_issues": len(pr.issues),
            "critical_count": sum(1 for i in pr.issues if i.severity == Severity.critical),
            "warning_count": sum(1 for i in pr.issues if i.severity == Severity.warning),
            "nitpick_count": sum(1 for i in pr.issues if i.severity == Severity.nitpick),
        }
        for pr in prs
    ]


@router.get("/reviews/{pr_id}")
def get_review(pr_id: str, db: Session = Depends(get_db)):
    """Return full review detail including all issues."""
    pr = db.query(PullRequest).filter(PullRequest.id == pr_id).first()
    if not pr:
        raise HTTPException(status_code=404, detail="Review not found")
    return build_review_response(pr)


@router.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    """Aggregate stats for the dashboard charts."""
    total_prs = db.query(PullRequest).count()
    total_issues = db.query(Issue).count()
    critical = db.query(Issue).filter(Issue.severity == Severity.critical).count()
    warnings = db.query(Issue).filter(Issue.severity == Severity.warning).count()
    nitpicks = db.query(Issue).filter(Issue.severity == Severity.nitpick).count()

    return {
        "total_prs_reviewed": total_prs,
        "total_issues_found": total_issues,
        "by_severity": {
            "critical": critical,
            "warning": warnings,
            "nitpick": nitpicks,
        },
    }
