from pydantic import BaseModel, field_validator
from typing import Optional, List, Any
from datetime import datetime


class TeamRole(BaseModel):
    role: str
    count: int


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
    notion_page_id: Optional[str] = None
    video_url: Optional[str] = None
    team_composition: List[Any] = []
    slide_url: Optional[str] = None

    @field_validator('team_composition', 'images', 'tech_stack', mode='before')
    @classmethod
    def empty_list_if_none(cls, v):
        return v if v is not None else []


class ProjectCreate(ProjectBase):
    pass  # ID는 서버에서 자동 생성


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
    notion_page_id: Optional[str] = None
    video_url: Optional[str] = None
    team_composition: Optional[List[Any]] = None
    slide_url: Optional[str] = None


class ProjectInDB(ProjectBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
