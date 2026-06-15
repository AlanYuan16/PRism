# PRism

AI-powered code review tool that analyzes GitHub PRs and local git diffs, surfaces issues ranked by severity, and tracks code quality trends over time.

## What it does

Point PRism at any GitHub PR or local git diff and it returns:

- **Line-by-line AI feedback** ranked by severity — critical, warning, nitpick
- **Suggested fixes** with concrete code examples for every issue
- **A summary** of the overall diff quality
- **Trend tracking** across all your PRs over time via a dashboard

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Python 3.12 + FastAPI |
| AI | Google Gemini API |
| Database | SQLite (dev) / PostgreSQL (prod) |
| ORM | SQLAlchemy |
| Frontend | Next.js 14 + TypeScript + Tailwind CSS |
| Deploy | Railway (backend) + Vercel (frontend) |

## Architecture

```
GitHub PR / local diff
        ↓
  Diff Chunker
  (splits on file boundaries,
  never mid-function)
        ↓
  Gemini AI
  (structured JSON output)
        ↓
  FastAPI + SQLAlchemy
  (persists issues + severity)
        ↓
  Next.js Dashboard
  (filter, browse, track trends)
```

## Key Engineering Decisions

**Diff chunking strategy** — Large diffs are split on file boundaries rather than character count. A naive splitter would cut in the middle of a function, making the AI review useless. By preserving file-level coherence, each chunk gives the AI full context for the code it's reviewing.

**Structured AI output** — Gemini is prompted to return strict JSON with a defined schema. The response parser handles malformed output gracefully without crashing the review pipeline, falling back cleanly on parse errors.

**Async webhook handling** — GitHub webhook reviews run as FastAPI background tasks so GitHub's 10-second timeout is never hit, even on large PRs with multiple diff chunks.

**Type-safe API layer** — The frontend defines explicit raw interfaces matching the backend's snake_case responses and maps them to camelCase domain types. No `any` types anywhere in the codebase.

## Getting Started

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux
pip install -r requirements.txt
cp .env.example .env
# Add your GEMINI_API_KEY to .env
uvicorn app.main:app --reload
```

API docs available at `http://localhost:8000/docs`

### CLI

```bash
cd backend

# Review staged changes
python cli.py

# Review diff against a branch
python cli.py --branch main

# Review a saved diff file
python cli.py --diff changes.diff
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Dashboard available at `http://localhost:3000`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/review` | Submit a diff for review |
| GET | `/api/reviews` | List all reviews |
| GET | `/api/reviews/{id}` | Get review detail |
| GET | `/api/stats` | Aggregate stats |
| POST | `/api/webhook/github` | GitHub webhook receiver |

## Roadmap

- [ ] GitHub Actions integration — auto-review every PR
- [ ] PostgreSQL + Supabase production database
- [ ] Deploy to Railway + Vercel
- [ ] Inline PR comments via GitHub API
- [ ] Multi-repo support with per-repo quality trends
- [ ] Auth with GitHub OAuth

## Author

**Alan Yuan** — [GitHub](https://github.com/AlanYuan16) · [LinkedIn](https://linkedin.com/in/alan-yuan-nyit)
