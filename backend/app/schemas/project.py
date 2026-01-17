from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class Metric(BaseModel):
    name: str
    value: str


class ProjectBase(BaseModel):
    title: str
    description: str
    long_description: Optional[str] = None
    model_type: str
    frameworks: List[str]
    technologies: List[str]
    image_url: str
    demo_url: Optional[str] = None
    github_url: Optional[str] = None
    paper_url: Optional[str] = None
    model_card_url: Optional[str] = None
    featured: bool = False
    metrics: Optional[List[Metric]] = None
    dataset: Optional[str] = None


class ProjectCreate(ProjectBase):
    id: str


class ProjectUpdate(ProjectBase):
    pass


class ProjectInDB(ProjectBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
