from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class SkillBase(BaseModel):
    name: str
    category: Optional[str] = None
    icon: Optional[str] = None
    order: int = 0


class SkillCreate(SkillBase):
    pass


class SkillUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    icon: Optional[str] = None
    order: Optional[int] = None


class SkillInDB(SkillBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
