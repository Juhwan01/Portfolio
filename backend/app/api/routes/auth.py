from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
import uuid

from ...core.database import get_db
from ...core.config import settings
from ...core.security import verify_password, get_password_hash, create_access_token, get_current_user
from ...models.admin import Admin
from ...schemas.auth import LoginRequest, Token

router = APIRouter()


@router.post("/login", response_model=Token)
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate admin and return JWT token"""
    admin = db.query(Admin).filter(Admin.username == login_data.username).first()

    if not admin or not verify_password(login_data.password, admin.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not admin.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin account is disabled",
        )

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": admin.username},
        expires_delta=access_token_expires
    )

    return Token(access_token=access_token)


@router.post("/register", response_model=Token)
def register_admin(login_data: LoginRequest, db: Session = Depends(get_db)):
    """Register a new admin (only works if no admins exist)"""
    existing_admin = db.query(Admin).first()
    if existing_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin registration is disabled",
        )

    hashed_password = get_password_hash(login_data.password)
    admin = Admin(
        id=str(uuid.uuid4()),
        username=login_data.username,
        hashed_password=hashed_password,
        is_active=True,
    )
    db.add(admin)
    db.commit()
    db.refresh(admin)

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": admin.username},
        expires_delta=access_token_expires
    )

    return Token(access_token=access_token)


@router.get("/me")
def get_current_admin(credentials: dict = Depends(get_current_user)):
    """Get current authenticated admin"""
    return {"username": credentials["username"]}
