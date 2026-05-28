"""
Diff chunker — splits large git diffs into context-window-safe chunks
without breaking file boundaries or losing code coherence.

This is the technically interesting part of the project.
A naive splitter would cut in the middle of a function — useless for review.
We split on file boundaries, keeping each file's diff intact.
"""

from dataclasses import dataclass


@dataclass
class DiffChunk:
    files: list[str]       # file paths included in this chunk
    content: str           # the raw diff content
    chunk_index: int
    total_chunks: int


def parse_diff_by_file(raw_diff: str) -> dict[str, str]:
    """
    Parse a raw git diff and split it into per-file sections.
    Returns a dict mapping file path -> that file's diff section.
    """
    files: dict[str, str] = {}
    current_file = None
    current_lines: list[str] = []

    for line in raw_diff.splitlines(keepends=True):
        if line.startswith("diff --git"):
            # Save the previous file's diff
            if current_file and current_lines:
                files[current_file] = "".join(current_lines)
            current_lines = [line]
            # Extract filename: "diff --git a/path/to/file.py b/path/to/file.py"
            parts = line.strip().split(" ")
            if len(parts) >= 4:
                current_file = parts[3][2:]  # strip the "b/" prefix
            else:
                current_file = "unknown"
        else:
            current_lines.append(line)

    # Don't forget the last file
    if current_file and current_lines:
        files[current_file] = "".join(current_lines)

    return files


def chunk_diff(raw_diff: str, max_chars: int = 12000) -> list[DiffChunk]:
    """
    Split a git diff into chunks that fit within the AI context window.

    Strategy:
    - Split by file boundary (never cut inside a file)
    - If a single file's diff exceeds max_chars, truncate with a note
    - Group small files together to minimize number of API calls

    max_chars=12000 leaves plenty of room for the system prompt + response
    within Gemini Flash's context window.
    """
    file_diffs = parse_diff_by_file(raw_diff)

    if not file_diffs:
        return []

    chunks: list[dict] = []
    current_files: list[str] = []
    current_content: list[str] = []
    current_size = 0

    for file_path, file_diff in file_diffs.items():
        # Truncate individual files that are too large
        if len(file_diff) > max_chars:
            file_diff = (
                file_diff[:max_chars]
                + f"\n\n... [truncated — file diff exceeded {max_chars} chars] ..."
            )

        # If adding this file would overflow the chunk, save current and start new
        if current_size + len(file_diff) > max_chars and current_files:
            chunks.append({
                "files": current_files,
                "content": "".join(current_content),
            })
            current_files = []
            current_content = []
            current_size = 0

        current_files.append(file_path)
        current_content.append(file_diff)
        current_size += len(file_diff)

    # Save the last chunk
    if current_files:
        chunks.append({
            "files": current_files,
            "content": "".join(current_content),
        })

    total = len(chunks)
    return [
        DiffChunk(
            files=c["files"],
            content=c["content"],
            chunk_index=i,
            total_chunks=total,
        )
        for i, c in enumerate(chunks)
    ]
