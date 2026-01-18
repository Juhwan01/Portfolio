from sqlalchemy import Column, String, Boolean, DateTime, JSON, Integer, Text
from sqlalchemy.sql import func
from ..core.database import Base


class Project(Base):
    __tablename__ = "projects"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)  # 짧은 설명
    content = Column(Text, nullable=True)  # 마크다운 지원 상세 설명
    category = Column(String, nullable=True)  # Web, Backend, AI, Mobile, DevOps 등
    tech_stack = Column(JSON, nullable=False, default=[])  # 사용 기술 목록
    thumbnail_url = Column(String, nullable=True)
    images = Column(JSON, nullable=True, default=[])  # 추가 이미지 URL 목록
    demo_url = Column(String, nullable=True)
    github_url = Column(String, nullable=True)
    featured = Column(Boolean, default=False)
    status = Column(String, default="completed")  # completed, in_progress, archived
    start_date = Column(String, nullable=True)  # 프로젝트 시작일
    end_date = Column(String, nullable=True)  # 프로젝트 종료일
    order = Column(Integer, default=0)  # 표시 순서
    notion_page_id = Column(String, nullable=True)  # Notion 페이지 ID
    video_url = Column(String, nullable=True)  # 프로젝트 영상 URL (YouTube 등)
    team_composition = Column(JSON, nullable=True, default=[])  # 팀 구성 [{role, count}]
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
