from sqlalchemy import Column, String, Integer, DateTime
from sqlalchemy.sql import func
from ..core.database import Base


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False, unique=True)
    category = Column(String, nullable=True)  # Language, Framework, Cloud, Database, Tool 등
    icon = Column(String, nullable=True)  # 아이콘 URL 또는 아이콘 이름
    order = Column(Integer, default=0)  # 표시 순서
    created_at = Column(DateTime(timezone=True), server_default=func.now())
