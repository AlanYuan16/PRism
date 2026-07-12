"""
AI reviewer service — sends diff chunks to Gemini and parses structured output.

The prompt is engineered to produce consistent JSON output we can reliably parse.
This is where the real prompt engineering work lives.
"""

import json
import logging

import google.generativeai as genai
from google.api_core import exceptions as google_exceptions

from app.core.config import get_settings
from app.services.diff_chunker import DiffChunk

logger = logging.getLogger(__name__)
settings = get_settings()

if not settings.gemini_api_key or not settings.gemini_api_key.strip():
    logger.error("GEMINI_API_KEY is missing or empty. Review service cannot start.")
    raise RuntimeError("GEMINI_API_KEY is missing or empty. Set the environment variable before starting the server.")

genai.configure(api_key=settings.gemini_api_key)


class ReviewServiceError(Exception):
    def __init__(self, status_code: int, message: str):
        super().__init__(message)
        self.status_code = status_code
        self.message = message

SYSTEM_PROMPT = """You are an expert software engineer performing a code review.
Analyze the provided git diff and identify issues. Be precise and actionable.

You MUST respond with valid JSON only. No markdown, no explanation outside the JSON.

Response format:
{
  "issues": [
    {
      "severity": "critical" | "warning" | "nitpick",
      "file_path": "path/to/file.py",
      "line_number": 42,
      "category": "security" | "performance" | "bug" | "style" | "maintainability",
      "description": "Clear explanation of the issue",
      "suggestion": "Concrete fix or improvement"
    }
  ],
  "summary": "2-3 sentence overall assessment of this diff"
}

Severity guide:
- critical: bugs, security vulnerabilities, data loss risks
- warning: performance issues, bad patterns, missing error handling
- nitpick: style, naming, minor improvements

Be specific. Reference actual code from the diff. If the diff looks clean, return an empty issues array.
"""


def review_chunk(chunk: DiffChunk) -> dict:
    """
    Send a single diff chunk to Gemini and return parsed review JSON.
    """
    model = genai.GenerativeModel("gemini-2.5-flash")

    user_message = f"""Review this git diff (chunk {chunk.chunk_index + 1} of {chunk.total_chunks}):

Files in this chunk: {", ".join(chunk.files)}

```diff
{chunk.content}
```
"""

    try:
        response = model.generate_content(
            [SYSTEM_PROMPT, user_message],
            generation_config=genai.GenerationConfig(
                temperature=0.2,
                max_output_tokens=8192,
            ),
        )
    except google_exceptions.ResourceExhausted as exc:
        logger.warning("Gemini review quota exceeded: %s", exc)
        raise ReviewServiceError(429, "Review service is temporarily unavailable due to quota limits.") from exc
    except google_exceptions.NotFound as exc:
        logger.warning("Gemini model unavailable: %s", exc)
        raise ReviewServiceError(502, "Review service is temporarily unavailable. Please try again later.") from exc
    except Exception as exc:  # pragma: no cover - defensive fallback
        logger.exception("Gemini review request failed")
        raise ReviewServiceError(502, "Review service could not process the diff.") from exc

    raw_text = response.text.strip()

    print(f"\n--- GEMINI RAW RESPONSE ---\n{raw_text}\n--- END ---\n")

    # Strip markdown code fences if Gemini wraps JSON in them
    if raw_text.startswith("```"):
        lines = raw_text.splitlines()
        raw_text = "\n".join(lines[1:-1])

    try:
        return json.loads(raw_text)
    except json.JSONDecodeError as e:
        print(f"JSON parse error: {e}")
        return {
            "issues": [],
            "summary": "Could not parse AI response for this chunk.",
            "parse_error": True,
        }


def review_diff(raw_diff: str) -> dict:
    """
    Full review pipeline:
    1. Chunk the diff
    2. Review each chunk
    3. Merge results
    """
    from app.services.diff_chunker import chunk_diff

    chunks = chunk_diff(raw_diff)

    if not chunks:
        return {"issues": [], "summary": "No diff content found."}

    all_issues = []
    summaries = []

    for chunk in chunks:
        result = review_chunk(chunk)
        all_issues.extend(result.get("issues", []))
        if result.get("summary"):
            summaries.append(result["summary"])

    # Sort issues by severity: critical first, then warning, then nitpick
    severity_order = {"critical": 0, "warning": 1, "nitpick": 2}
    all_issues.sort(key=lambda x: severity_order.get(x.get("severity", "nitpick"), 2))

    return {
        "issues": all_issues,
        "summary": " ".join(summaries),
        "total_chunks_processed": len(chunks),
    }