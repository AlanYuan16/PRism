import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.core.database import Base, engine

logger = logging.getLogger(__name__)
settings = get_settings()

if not settings.gemini_api_key or not settings.gemini_api_key.strip():
    logger.error("GEMINI_API_KEY is missing or empty. The application cannot start.")
    raise RuntimeError("GEMINI_API_KEY is missing or empty. Set the environment variable before starting the server.")

from app.api.routes import router

# Create all tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Code Review Assistant",
    description="Automated code review powered by Gemini AI",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "ai-code-review"}
