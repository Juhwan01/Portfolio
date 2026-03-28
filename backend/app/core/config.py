import sys
from pydantic_settings import BaseSettings
from typing import Optional


_INSECURE_SECRET = "your-secret-key-here-change-in-production"


class Settings(BaseSettings):
    # App
    APP_NAME: str = "Portfolio API"
    VERSION: str = "1.0.0"
    DEBUG: bool = False

    # Database
    DATABASE_URL: str = "postgresql://user:password@localhost/portfolio"

    # AWS S3
    AWS_ACCESS_KEY_ID: str = ""
    AWS_SECRET_ACCESS_KEY: str = ""
    AWS_REGION: str = "ap-northeast-2"
    S3_BUCKET_NAME: str = ""

    # Email
    SMTP_HOST: Optional[str] = None
    SMTP_PORT: Optional[int] = 587
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    EMAIL_FROM: Optional[str] = None

    # CORS
    CORS_ORIGINS: list[str] = ["http://localhost:3000"]

    # Security
    SECRET_KEY: str = _INSECURE_SECRET
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # Notion
    NOTION_TOKEN: Optional[str] = None

    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"


settings = Settings()

if not settings.DEBUG and settings.SECRET_KEY == _INSECURE_SECRET:
    print("FATAL: SECRET_KEY is using the default insecure value. Set SECRET_KEY in .env")
    sys.exit(1)
