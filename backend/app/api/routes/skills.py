from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from ...core.database import get_db
from ...core.security import get_current_user
from ...models.skill import Skill
from ...schemas.skill import SkillCreate, SkillUpdate, SkillInDB

router = APIRouter()


@router.get("/", response_model=List[SkillInDB])
def get_skills(
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get all skills, optionally filtered by category"""
    query = db.query(Skill)
    if category:
        query = query.filter(Skill.category == category)
    skills = query.order_by(Skill.order, Skill.name).all()
    return skills


@router.get("/{skill_id}", response_model=SkillInDB)
def get_skill(skill_id: int, db: Session = Depends(get_db)):
    """Get a specific skill by ID"""
    skill = db.query(Skill).filter(Skill.id == skill_id).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    return skill


@router.post("/", response_model=SkillInDB)
def create_skill(
    skill: SkillCreate,
    db: Session = Depends(get_db),
    _: dict = Depends(get_current_user)
):
    """Create a new skill (requires authentication)"""
    existing = db.query(Skill).filter(Skill.name == skill.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Skill already exists")

    db_skill = Skill(**skill.model_dump())
    db.add(db_skill)
    db.commit()
    db.refresh(db_skill)
    return db_skill


@router.post("/bulk", response_model=List[SkillInDB])
def create_skills_bulk(
    skills: List[SkillCreate],
    db: Session = Depends(get_db),
    _: dict = Depends(get_current_user)
):
    """Create multiple skills at once (requires authentication)"""
    created_skills = []
    for skill in skills:
        existing = db.query(Skill).filter(Skill.name == skill.name).first()
        if not existing:
            db_skill = Skill(**skill.model_dump())
            db.add(db_skill)
            created_skills.append(db_skill)

    db.commit()
    for skill in created_skills:
        db.refresh(skill)
    return created_skills


@router.put("/{skill_id}", response_model=SkillInDB)
def update_skill(
    skill_id: int,
    skill: SkillUpdate,
    db: Session = Depends(get_db),
    _: dict = Depends(get_current_user)
):
    """Update an existing skill (requires authentication)"""
    db_skill = db.query(Skill).filter(Skill.id == skill_id).first()
    if not db_skill:
        raise HTTPException(status_code=404, detail="Skill not found")

    update_data = skill.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_skill, key, value)

    db.commit()
    db.refresh(db_skill)
    return db_skill


@router.delete("/{skill_id}")
def delete_skill(
    skill_id: int,
    db: Session = Depends(get_db),
    _: dict = Depends(get_current_user)
):
    """Delete a skill (requires authentication)"""
    db_skill = db.query(Skill).filter(Skill.id == skill_id).first()
    if not db_skill:
        raise HTTPException(status_code=404, detail="Skill not found")

    db.delete(db_skill)
    db.commit()
    return {"message": "Skill deleted successfully"}
