#!/usr/bin/env python3
"""
AI Code Review CLI

Usage:
  python cli.py                          # review staged changes
  python cli.py --branch main            # review diff against main
  python cli.py --diff path/to/file.diff # review a saved diff file

This is the tool you'll demo in interviews.
"""

import sys
import subprocess
import argparse
import httpx
import json


API_BASE = "http://localhost:8000/api"


def get_git_diff(branch: str | None = None) -> str:
    """Get diff from git — either staged changes or against a branch."""
    try:
        if branch:
            cmd = ["git", "diff", branch]
        else:
            cmd = ["git", "diff", "--staged"]

        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        return result.stdout
    except subprocess.CalledProcessError as e:
        print(f"Git error: {e.stderr}")
        sys.exit(1)


def get_current_branch() -> str:
    try:
        result = subprocess.run(
            ["git", "rev-parse", "--abbrev-ref", "HEAD"],
            capture_output=True, text=True, check=True
        )
        return result.stdout.strip()
    except subprocess.CalledProcessError:
        return "unknown"


def print_issue(issue: dict, index: int):
    severity = issue.get("severity", "nitpick")
    emoji = {"critical": "🔴", "warning": "🟡", "nitpick": "🔵"}.get(severity, "⚪")

    print(f"\n{emoji} [{severity.upper()}] {issue.get('category', '').upper()}")
    print(f"   File: {issue.get('file_path', 'unknown')}", end="")
    if issue.get("line_number"):
        print(f" (line {issue['line_number']})", end="")
    print()
    print(f"   Issue: {issue.get('description', '')}")
    if issue.get("suggestion"):
        print(f"   Fix:   {issue['suggestion']}")


def main():
    parser = argparse.ArgumentParser(description="AI Code Review CLI")
    parser.add_argument("--branch", help="Review diff against this branch")
    parser.add_argument("--diff", help="Path to a saved .diff file")
    parser.add_argument("--json", action="store_true", help="Output raw JSON")
    args = parser.parse_args()

    # Get the diff
    if args.diff:
        with open(args.diff) as f:
            raw_diff = f.read()
    else:
        raw_diff = get_git_diff(branch=args.branch)

    if not raw_diff.strip():
        print("No changes found. Stage some changes or specify a branch.")
        sys.exit(0)

    branch = get_current_branch()
    print(f"\n🔍 Reviewing changes on branch: {branch}")
    print(f"   Diff size: {len(raw_diff):,} chars")
    print("   Sending to AI reviewer...\n")

    # Call the API
    try:
        response = httpx.post(
            f"{API_BASE}/review",
            json={
                "diff": raw_diff,
                "repo": "local",
                "pr_number": 0,
                "title": f"CLI review — {branch}",
                "author": "local",
            },
            timeout=60.0,
        )
        response.raise_for_status()
        data = response.json()
    except httpx.ConnectError:
        print("Cannot connect to the API. Is the backend running?")
        print("Run: uvicorn app.main:app --reload")
        sys.exit(1)

    if args.json:
        print(json.dumps(data, indent=2))
        return

    # Pretty print results
    issues = data.get("issues", [])
    summary = data.get("summary", "")

    print("─" * 60)
    print(f"  REVIEW COMPLETE")
    print("─" * 60)
    print(f"  Total issues:  {data.get('total_issues', 0)}")
    print(f"  🔴 Critical:   {data.get('critical_count', 0)}")
    print(f"  🟡 Warning:    {data.get('warning_count', 0)}")
    print(f"  🔵 Nitpick:    {data.get('nitpick_count', 0)}")
    print("─" * 60)

    if summary:
        print(f"\nSummary: {summary}")

    if not issues:
        print("\n✅ No issues found. Clean diff!")
        return

    print(f"\nIssues ({len(issues)}):")
    for i, issue in enumerate(issues, 1):
        print_issue(issue, i)

    print()


if __name__ == "__main__":
    main()
