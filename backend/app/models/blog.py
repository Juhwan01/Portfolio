from sqlalchemy import Column, String, Integer, DateTime, JSON
from sqlalchemy.sql import func
from ..core.database import Base


class BlogPost(Base):
    __tablename__ = "blog_posts"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    excerpt = Column(String, nullable=False)
    content = Column(String, nullable=False)
    cover_image = Column(String, nullable=False)
    tags = Column(JSON, nullable=False)  # List of tags
    category = Column(String, nullable=False)  # research, tutorial, case-study, review
    read_time = Column(Integer, nullable=False)  # in minutes
    published_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
