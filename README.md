# Jung Juhwan — AI Engineer Portfolio

<div align="center">

![Neural Noir](https://img.shields.io/badge/Design_System-Neural_Noir-665bff?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.128-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-0.161-000000?style=for-the-badge&logo=threedotjs&logoColor=white)

**AI Engineer 포트폴리오 — Neural Noir 디자인 시스템 기반 풀스택 웹 애플리케이션**

[Live Site](https://juhwan.dev) · [Report Bug](https://github.com/Juhwan01/Portfolio/issues)

</div>

---

<!-- 스크린샷: 배포 후 실제 화면 캡처해서 교체하세요 -->
<!-- ![Hero Screenshot](docs/screenshots/hero.png) -->
<!-- ![Projects Screenshot](docs/screenshots/projects.png) -->

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Nginx (SSL/TLS)                       │
│                   juhwan.dev:443                         │
├──────────────────────┬──────────────────────────────────┤
│   /  → Frontend      │   /api  → Backend                │
│   React + Vite       │   FastAPI + PostgreSQL            │
│   Port 3000          │   Port 8000                       │
├──────────────────────┴──────────────────────────────────┤
│                    Docker Compose                        │
│               AWS Lightsail Instance                     │
└─────────────────────────────────────────────────────────┘
```

## Tech Stack

| Layer | Tech |
|-------|------|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Framer Motion |
| **3D** | Three.js, React Three Fiber (Hero 파티클 전용) |
| **Content** | react-markdown, remark-gfm, rehype-highlight |
| **Admin** | @uiw/react-md-editor (Markdown 에디터) |
| **Backend** | FastAPI, SQLAlchemy, Alembic, PostgreSQL |
| **Auth** | JWT (python-jose), bcrypt |
| **Storage** | AWS S3 (이미지 업로드) |
| **Deploy** | Docker Compose, Nginx, Let's Encrypt, AWS Lightsail |
| **CI/CD** | GitHub Actions (빌드 검증 + SSH 자동 배포) |

## Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Hero 파티클 배경 + 벤토 그리드 |
| `/about` | About | 자기소개 + 경력 + 기술 하이라이트 |
| `/projects` | Projects | 카테고리 필터 + 프로젝트 카드 그리드 |
| `/projects/:id` | Detail | Markdown 콘텐츠 + 사이드바 (2컬럼) |
| `/skills` | Skills | 벤토 그리드 스킬 카드 |
| `/blog` | Blog | 블로그 리스팅 + 카테고리 필터 |
| `/blog/:id` | Post | Markdown 본문 + 태그 |
| `/contact` | Contact | 연락 폼 + 소셜 링크 |
| `/admin/*` | Admin | 프로젝트/스킬/블로그 CRUD |

---

## Design System: Neural Noir

```
Background  #0e0e13     Surface Low   #131319
Surface     #19191f     Surface High  #1f1f26
Primary     #a8a4ff     Primary Dim   #665bff
Tertiary    #ff9dcf     On Surface    #f9f5fd
Font: Inter             Roundness: 4px
```

**핵심 원칙**
- **No-Line Rule** — 보더 대신 배경색 차이로 섹션 구분
- **Glass Effect** — `backdrop-blur 20px` + `surface-container 60%`
- **Neural Glow** — `box-shadow 40px, primary 8% opacity`
- **Intelligence Chips** — 기술 태그에 `#ff9dcf` 라이브 인디케이터

---

## Getting Started

### Prerequisites

- Node.js 20+
- Python 3.11+
- PostgreSQL 15+
- Docker & Docker Compose (배포 시)

### Local Development

```bash
# Clone
git clone https://github.com/Juhwan01/Portfolio.git
cd Portfolio

# Backend
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # 환경변수 편집
alembic upgrade head            # DB 마이그레이션
uvicorn app.main:app --reload   # http://localhost:8000

# Frontend (새 터미널)
cd frontend
npm install
npm run dev                     # http://localhost:3000
```

API 문서: http://localhost:8000/docs

### Environment Variables

**Backend (`backend/.env`)**
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/portfolio
SECRET_KEY=your-random-secret-key
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
S3_BUCKET_NAME=your-bucket
CORS_ORIGINS=["http://localhost:3000"]
```

**Frontend (`frontend/.env`)**
```env
VITE_API_BASE_URL=http://localhost:8000
VITE_S3_BUCKET_URL=https://your-bucket.s3.amazonaws.com
```

### Docker (Production)

```bash
docker compose up -d --build
```

---

## CI/CD Pipeline

### GitHub Actions Workflows

| Workflow | Trigger | Steps |
|----------|---------|-------|
| **CI** (`ci.yml`) | PR → `main` | TypeScript 체크 → Vite 빌드 → Backend import 검증 |
| **Deploy** (`deploy.yml`) | Push → `main` | 빌드 검증 → SSH → `git pull` → `docker compose up --build` |

### Setup Required Secrets

GitHub repo → Settings → Secrets and variables → Actions:

| Secret | Example | Description |
|--------|---------|-------------|
| `LIGHTSAIL_HOST` | `13.xx.xx.xx` | Lightsail 퍼블릭 IP |
| `LIGHTSAIL_USER` | `ubuntu` | SSH 사용자명 |
| `LIGHTSAIL_SSH_KEY` | `-----BEGIN RSA...` | SSH 프라이빗 키 (PEM 전체) |
| `LIGHTSAIL_PORT` | `22` | SSH 포트 |

### Deploy Flow

```
Push to main → GitHub Actions → Build check passes
  → SSH into Lightsail → git pull → docker compose rebuild
  → Nginx routes traffic → Live at juhwan.dev
```

---

## Project Structure

```
Portfolio/
├── .github/workflows/          # CI/CD
│   ├── ci.yml                  # PR 검증
│   └── deploy.yml              # 자동 배포
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── 3d/             # Three.js 파티클
│   │   │   ├── admin/          # ProjectForm, MarkdownEditor, BlogAdmin
│   │   │   ├── common/         # Navbar, Footer, SlideViewer
│   │   │   ├── content/        # MarkdownRenderer, ProjectSidebar
│   │   │   ├── sections/       # Hero (벤토 그리드 포함)
│   │   │   └── ui/             # NNButton, NNCard, NNBadge, NNInput
│   │   ├── layouts/            # PublicLayout
│   │   ├── pages/              # 8 public + 5 admin 페이지
│   │   ├── services/api.ts     # Axios 클라이언트
│   │   ├── stores/             # Zustand (Auth)
│   │   ├── styles/             # globals.css, neural-noir.css, design-tokens.ts
│   │   ├── types/              # TypeScript 인터페이스
│   │   └── utils/              # constants, helpers
│   ├── Dockerfile
│   └── package.json
├── backend/
│   ├── app/
│   │   ├── api/routes/         # projects, blog, skills, contact, auth, upload
│   │   ├── core/               # config, database, security
│   │   ├── models/             # SQLAlchemy (Project, Blog, Skill, Contact, Admin)
│   │   └── schemas/            # Pydantic 스키마
│   ├── alembic/                # DB 마이그레이션
│   ├── Dockerfile
│   └── requirements.txt
├── docker-compose.yml
├── nginx.conf
└── README.md
```

---

## Admin Guide

### 프로젝트 관리
1. `/admin` 로그인
2. Projects → New Project
3. **Markdown 에디터**로 상세 내용 작성 (라이브 프리뷰)
4. 썸네일 업로드, 기술 스택, 팀 구성, 링크 등 입력

### 블로그 관리
1. Blog → New Post
2. 카테고리: Research / Tutorial / Case Study / Review
3. Markdown 본문 + 커버 이미지 + 태그

### Markdown 작성 팁
- 코드 블록에 언어 명시 → 구문 강조 (` ```python `)
- GFM 지원: 테이블, 취소선, 체크리스트
- 이미지: S3 업로드 후 `![alt](url)` 삽입

---

## AWS S3 Setup

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["https://juhwan.dev", "http://localhost:3000"],
    "ExposeHeaders": []
  }
]
```

## Database

```bash
# 초기 생성
CREATE DATABASE portfolio;

# 마이그레이션 실행
cd backend && alembic upgrade head
```

---

<div align="center">

**Built with Neural Noir Framework**

`#0e0e13` · `#a8a4ff` · `#665bff` · `#ff9dcf`

</div>
