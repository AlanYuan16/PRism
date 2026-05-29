"""
AI reviewer service — sends diff chunks to Gemini and parses structured output.

The prompt is engineered to produce consistent JSON output we can reliably parse.
This is where the real prompt engineering work lives.
"""

import json
import google.generativeai as genai
from app.core.config import get_settings
from app.services.diff_chunker import DiffChunk

settings = get_settings()
genai.configure(api_key=settings.gemini_api_key)

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

    response = model.generate_content(
        [SYSTEM_PROMPT, user_message],
        generation_config=genai.GenerationConfig(
            temperature=0.2,
            max_output_tokens=8192,
    ),
    )

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