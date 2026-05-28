from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import enum
import uuid


def generate_uuid():
    return str(uuid.uuid4())


class Severity(str, enum.Enum):
    critical = "critical"
    warning = "warning"
    nitpick = "nitpick"


class Repo(Base):
    __tablename__ = "repos"

    id = Column(String, primary_key=True, default=generate_uuid)
    github_repo = Column(String, unique=True, nullable=False)  # e.g. "AlanYuan16/myrepo"
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    pull_requests = relationship("PullRequest", back_populates="repo")


class PullRequest(Base):
    __tablename__ = "pull_requests"

    id = Column(String, primary_key=True, default=generate_uuid)
    repo_id = Column(String, ForeignKey("repos.id"), nullable=False)
    pr_number = Column(Integer, nullable=False)
    title = Column(String, nullable=False)
    author = Column(String, nullable=False)
    diff_url = Column(String)
    reviewed_at = Column(DateTime(timezone=True), server_default=func.now())

    repo = relationship("Repo", back_populates="pull_requests")
    issues = relationship("Issue", back_populates="pull_request")


class Issue(Base):
    __tablename__ = "issues"

    id = Column(String, primary_key=True, default=generate_uuid)
    pull_request_id = Column(String, ForeignKey("pull_requests.id"), nullable=False)
    severity = Column(Enum(Severity), nullable=False)
    file_path = Column(String, nullable=False)
    line_number = Column(Integer)
    category = Column(String)        # e.g. "security", "performance", "style"
    description = Column(Text, nullable=False)
    suggestion = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    pull_request = relationship("PullRequest", back_populates="issues")
