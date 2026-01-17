from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class ProjectBase(BaseModel):
    title: str
    description: str
    content: Optional[str] = None
    category: Optional[str] = None
    tech_stack: List[str] = []
    thumbnail_url: Optional[str] = None
    images: List[str] = []
    demo_url: Optional[str] = None
    github_url: Optional[str] = None
    featured: bool = False
    status: str = "completed"
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    order: int = 0


class ProjectCreate(ProjectBase):
    id: str


class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    content: Optional[str] = None
    category: Optional[str] = None
    tech_stack: Optional[List[str]] = None
    thumbnail_url: Optional[str] = None
    images: Optional[List[str]] = None
    demo_url: Optional[str] = None
    github_url: Optional[str] = None
    featured: Optional[bool] = None
    status: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    order: Optional[int] = None


class ProjectInDB(ProjectBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
