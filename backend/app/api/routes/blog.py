from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ...core.database import get_db
from ...models.blog import BlogPost
from ...schemas.blog import BlogPostCreate, BlogPostUpdate, BlogPostInDB

router = APIRouter()


@router.get("/", response_model=List[BlogPostInDB])
def get_blog_posts(db: Session = Depends(get_db)):
    """Get all blog posts"""
    posts = db.query(BlogPost).order_by(BlogPost.published_at.desc()).all()
    return posts


@router.get("/{post_id}", response_model=BlogPostInDB)
def get_blog_post(post_id: str, db: Session = Depends(get_db)):
    """Get a specific blog post by ID"""
    post = db.query(BlogPost).filter(BlogPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return post


@router.post("/", response_model=BlogPostInDB)
def create_blog_post(post: BlogPostCreate, db: Session = Depends(get_db)):
    """Create a new blog post"""
    db_post = BlogPost(**post.model_dump())
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post


@router.put("/{post_id}", response_model=BlogPostInDB)
def update_blog_post(
    post_id: str,
    post: BlogPostUpdate,
    db: Session = Depends(get_db)
):
    """Update an existing blog post"""
    db_post = db.query(BlogPost).filter(BlogPost.id == post_id).first()
    if not db_post:
        raise HTTPException(status_code=404, detail="Blog post not found")

    for key, value in post.model_dump().items():
        setattr(db_post, key, value)

    db.commit()
    db.refresh(db_post)
    return db_post


@router.delete("/{post_id}")
def delete_blog_post(post_id: str, db: Session = Depends(get_db)):
    """Delete a blog post"""
    db_post = db.query(BlogPost).filter(BlogPost.id == post_id).first()
    if not db_post:
        raise HTTPException(status_code=404, detail="Blog post not found")

    db.delete(db_post)
    db.commit()
    return {"message": "Blog post deleted successfully"}
