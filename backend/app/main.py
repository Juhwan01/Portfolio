from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .api.routes import projects, blog, contact, upload, auth, skills, notion
from .models import Project, Admin, Skill

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    debug=settings.DEBUG,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(projects.router, prefix="/api/projects", tags=["projects"])
app.include_router(blog.router, prefix="/api/blog", tags=["blog"])
app.include_router(contact.router, prefix="/api/contact", tags=["contact"])
app.include_router(upload.router, prefix="/api/upload", tags=["upload"])
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(skills.router, prefix="/api/skills", tags=["skills"])
app.include_router(notion.router, prefix="/api/notion", tags=["notion"])


@app.get("/")
async def root():
    return {
        "message": "Portfolio API",
        "version": settings.VERSION,
        "docs": "/docs",
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}

