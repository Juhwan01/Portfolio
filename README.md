# AI Engineer Portfolio

Modern, interactive 3D portfolio website built with React, Three.js, and FastAPI.

## Features

- 3D interactive homepage with Three.js
- AI/ML project showcase
- Technical blog
- Skills visualization
- Contact form
- AWS S3 image storage
- Responsive design with Tailwind CSS
- Glassmorphism UI effects

## Tech Stack

### Frontend
- **React** 18 with TypeScript
- **Vite** for fast development
- **Three.js** & React Three Fiber for 3D graphics
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Zustand** for state management
- **React Router** for navigation

### Backend
- **FastAPI** for REST API
- **PostgreSQL** for database
- **SQLAlchemy** ORM
- **Pydantic** for validation
- **AWS S3** for image storage
- **Alembic** for migrations

## Project Structure

```
Portfolio/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── 3d/          # Three.js components
│   │   │   ├── common/      # Reusable UI components
│   │   │   └── sections/    # Page sections
│   │   ├── pages/           # Route pages
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API services
│   │   ├── utils/           # Utilities
│   │   ├── types/           # TypeScript types
│   │   └── styles/          # Global styles
│   └── public/
└── backend/                 # FastAPI backend
    ├── app/
    │   ├── api/
    │   │   └── routes/      # API endpoints
    │   ├── core/            # Config & database
    │   ├── models/          # Database models
    │   ├── schemas/         # Pydantic schemas
    │   └── services/        # Business logic
    ├── alembic/             # DB migrations
    └── tests/

```

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+
- PostgreSQL
- AWS Account (for S3)

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Update .env with your API URL and S3 bucket URL

# Start development server
npm run dev
```

The frontend will run on [http://localhost:3000](http://localhost:3000)

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment variables
cp .env.example .env

# Update .env with your database, AWS credentials, etc.

# Run migrations
alembic upgrade head

# Start development server
uvicorn app.main:app --reload
```

The backend will run on [http://localhost:8000](http://localhost:8000)

API documentation available at [http://localhost:8000/docs](http://localhost:8000/docs)

## Environment Variables

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:8000
VITE_S3_BUCKET_URL=https://your-bucket.s3.amazonaws.com
```

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/portfolio
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
S3_BUCKET_NAME=your-bucket
```

See `.env.example` files for complete configuration options.

## AWS S3 Setup

1. Create an S3 bucket
2. Enable public access for images
3. Add CORS configuration:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["http://localhost:3000"],
    "ExposeHeaders": []
  }
]
```

4. Add your credentials to `.env`

## Database Setup

1. Create PostgreSQL database:
```sql
CREATE DATABASE portfolio;
```

2. Update `DATABASE_URL` in backend `.env`

3. Run migrations:
```bash
cd backend
alembic upgrade head
```

## Customization

### Update Personal Info

- Update social links in `frontend/src/utils/constants.ts`
- Modify skills in `frontend/src/components/sections/Skills.tsx`
- Change branding in `frontend/src/components/common/Navbar.tsx` and `Footer.tsx`

### Add Projects

Use the API to add projects:

```bash
POST /api/projects
{
  "id": "unique-id",
  "title": "Project Title",
  "description": "Short description",
  "model_type": "LLM",
  "frameworks": ["PyTorch", "Hugging Face"],
  "technologies": ["Python", "FastAPI"],
  "image_url": "https://...",
  "featured": true
}
```

### 3D Scene Customization

Modify `frontend/src/components/3d/Scene.tsx` to customize the 3D elements, colors, animations, etc.

## Deployment

### Frontend (Vercel/Netlify)

```bash
cd frontend
npm run build
# Deploy the dist/ folder
```

### Backend (Railway/Heroku/AWS)

```bash
# Make sure all environment variables are set
# Deploy using your platform's CLI or dashboard
```

## License

MIT

## Contact

For questions or collaboration, reach out via the contact form or:
- GitHub: [yourusername](https://github.com/yourusername)
- LinkedIn: [yourprofile](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com
