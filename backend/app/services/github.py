"""
GitHub webhook handler — receives PR events and triggers reviews.
"""

import hashlib
import hmac
from app.core.config import get_settings
import httpx

settings = get_settings()


def verify_webhook_signature(payload: bytes, signature: str) -> bool:
    """
    Verify that the webhook came from GitHub using HMAC-SHA256.
    This is important — without it anyone could POST fake PR events.
    """
    if not settings.github_webhook_secret:
        return True  # Skip verification in dev if no secret set

    expected = "sha256=" + hmac.new(
        settings.github_webhook_secret.encode(),
        payload,
        hashlib.sha256,
    ).hexdigest()

    return hmac.compare_digest(expected, signature)


async def fetch_pr_diff(repo: str, pr_number: int) -> str:
    """
    Fetch the raw diff for a GitHub PR using the GitHub API.
    Returns the raw diff string.
    """
    url = f"https://api.github.com/repos/{repo}/pulls/{pr_number}"
    headers = {
        "Accept": "application/vnd.github.v3.diff",
        "Authorization": f"Bearer {settings.github_token}",
    }

    async with httpx.AsyncClient() as client:
        response = client.get(url, headers=headers, follow_redirects=True)
        response.raise_for_status()
        return response.text
