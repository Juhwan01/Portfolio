from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from urllib.parse import unquote
from ...core.database import get_db
from ...core.security import get_current_user
from ...models.project import Project
from ...schemas.project import ProjectCreate, ProjectUpdate, ProjectInDB

router = APIRouter()


@router.get("/", response_model=List[ProjectInDB])
def get_projects(
    featured: Optional[bool] = None,
    category: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get all projects, optionally filtered by featured, category, status"""
    query = db.query(Project)
    if featured is not None:
        query = query.filter(Project.featured == featured)
    if category:
        query = query.filter(Project.category == category)
    if status:
        query = query.filter(Project.status == status)
    projects = query.order_by(Project.order, Project.created_at.desc()).all()
    return projects


@router.get("/{project_id}", response_model=ProjectInDB)
def get_project(project_id: str, db: Session = Depends(get_db)):
    """Get a specific project by ID"""
    project_id = unquote(project_id)
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.post("/", response_model=ProjectInDB)
def create_project(
    project: ProjectCreate,
    db: Session = Depends(get_db),
    _: dict = Depends(get_current_user)
):
    """Create a new project (requires authentication)"""
    db_project = Project(**project.model_dump())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project


@router.put("/{project_id}", response_model=ProjectInDB)
def update_project(
    project_id: str,
    project: ProjectUpdate,
    db: Session = Depends(get_db),
    _: dict = Depends(get_current_user)
):
    """Update an existing project (requires authentication)"""
    project_id = unquote(project_id)
    db_project = db.query(Project).filter(Project.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")

    update_data = project.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_project, key, value)

    db.commit()
    db.refresh(db_project)
    return db_project


@router.delete("/{project_id}")
def delete_project(
    project_id: str,
    db: Session = Depends(get_db),
    _: dict = Depends(get_current_user)
):
    """Delete a project (requires authentication)"""
    project_id = unquote(project_id)
    db_project = db.query(Project).filter(Project.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")

    db.delete(db_project)
    db.commit()
    return {"message": "Project deleted successfully"}
