from sqlalchemy import Column, String, Boolean, DateTime, JSON, Integer
from sqlalchemy.sql import func
from ..core.database import Base


class Project(Base):
    __tablename__ = "projects"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    long_description = Column(String, nullable=True)
    model_type = Column(String, nullable=False)  # LLM, Computer Vision, etc.
    frameworks = Column(JSON, nullable=False)  # List of frameworks
    technologies = Column(JSON, nullable=False)  # List of technologies
    image_url = Column(String, nullable=False)
    demo_url = Column(String, nullable=True)
    github_url = Column(String, nullable=True)
    paper_url = Column(String, nullable=True)
    model_card_url = Column(String, nullable=True)
    featured = Column(Boolean, default=False)
    metrics = Column(JSON, nullable=True)  # List of metric objects
    dataset = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
