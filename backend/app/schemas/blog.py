from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class BlogPostBase(BaseModel):
    title: str
    excerpt: str
    content: str
    cover_image: str
    tags: List[str]
    category: str  # research, tutorial, case-study, review
    read_time: int


class BlogPostCreate(BlogPostBase):
    id: str


class BlogPostUpdate(BlogPostBase):
    pass


class BlogPostInDB(BlogPostBase):
    id: str
    published_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
