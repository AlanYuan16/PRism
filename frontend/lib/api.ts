import type {
  ReviewDetail,
  ReviewSummary,
  Stats,
  SubmitReviewPayload,
  SubmitReviewResponse,
} from "@/lib/types";
interface RawReview {
  id: string;
  repo: string;
  title: string;
  pr_number: number;
  author: string;
  reviewed_at: string;
  total_issues: number;
  critical_count: number;
  warning_count: number;
  nitpick_count: number;
}

interface RawIssue {
  id: string;
  file_path: string;
  line_number: number;
  severity: "critical" | "warning" | "nitpick";
  category: string;
  description: string;
  suggestion: string;
}

interface RawReviewDetail {
  pull_request_id: string;
  summary: string;
  total_issues: number;
  critical_count: number;
  warning_count: number;
  nitpick_count: number;
  issues: RawIssue[];
}
interface RawStats {
  total_prs_reviewed: number;
  total_issues_found: number;
  by_severity: {
    critical: number;
    warning: number;
    nitpick: number;
  };
}
const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api";

async function safeFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    cache: "no-store",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers as Record<string, string>),
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Failed API request ${response.status}: ${body || response.statusText}`);
  }

  return response.json();
}


export async function getStats(): Promise<Stats> {
  try {
    const raw = await safeFetch<RawStats>("/stats");
    return {
      totalReviews: raw.total_prs_reviewed,
      totalIssues: raw.total_issues_found,
      criticalCount: raw.by_severity.critical,
      openRepos: 0, // not tracked by backend yet
    };
  } catch (error) {
    console.error("Failed to fetch stats", error);
    throw error;
  }
}
export async function getReviews(): Promise<ReviewSummary[]> {
  try {
    const raw = await safeFetch<RawReview[]>("/reviews");
    return raw.map((r) => ({
      id: r.id,
      repoName: r.repo,
      prTitle: r.title,
      prNumber: String(r.pr_number),
      author: r.author,
      createdAt: new Date(r.reviewed_at).toLocaleDateString(),
      issueCounts: {
        total: r.total_issues,
        critical: r.critical_count,
        warning: r.warning_count,
        nitpick: r.nitpick_count,
      },
    }));
  } catch (error) {
    console.error("Failed to fetch reviews", error);
    throw error;
  }
}

export async function getReviewById(id: string): Promise<ReviewDetail> {
  try {
    const r = await safeFetch<RawReviewDetail>(`/reviews/${encodeURIComponent(id)}`);
    return {
      id: r.pull_request_id,
      repoName: "local",
      prTitle: "Review",
      prNumber: "0",
      author: "unknown",
      createdAt: new Date().toLocaleDateString(),
      branch: "",
      summary: r.summary,
      issueCounts: {
        total: r.total_issues,
        critical: r.critical_count,
        warning: r.warning_count,
        nitpick: r.nitpick_count,
      },
      issues: r.issues.map((i: RawIssue) => ({
        id: i.id,
        filePath: i.file_path,
        line: i.line_number,
        severity: i.severity,
        category: i.category,
        description: i.description,
        suggestion: i.suggestion,
      })),
    };
  } catch (error) {
    console.error(`Failed to fetch review ${id}`, error);
    throw error;
  }
}

export async function submitReview(
  payload: SubmitReviewPayload,
): Promise<SubmitReviewResponse> {
  try {
    const raw = await safeFetch<{ pull_request_id: string }>("/review", {
      method: "POST",
      body: JSON.stringify({
        diff: payload.diff,
        repo: payload.repoName,
        pr_number: parseInt(payload.prNumber),
        title: payload.title,
        author: payload.author,
      }),
    });
    return { id: raw.pull_request_id };
  } catch (error) {
    console.error("Failed to submit review", error);
    throw error;
  }
}
