# Spire — Course Subscription Platform

A production-ready, full-stack course subscription platform with structured learning, DRM video protection, progress tracking, gamification, and Razorpay payment integration.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router, TypeScript, Tailwind CSS) |
| Animations | Framer Motion |
| Backend | FastAPI (Python 3.12) |
| ORM | SQLAlchemy 2.0 |
| Database | SQLite (dev) / PostgreSQL (prod via Supabase) |
| Auth | JWT (python-jose + bcrypt) |
| Payments | Razorpay (order creation + HMAC-SHA256 verification) |
| Video DRM | EME (Encrypted Media Extensions) + Widevine/FairPlay ready |
| Deployment | Docker, Vercel (frontend), Railway (backend) |

## Features

- **Authentication** — Register, login, JWT access/refresh tokens, role-based access (Student/Instructor/Admin)
- **Course Catalog** — 6 courses, level filters, search, 3-column responsive grid
- **Course Detail** — Lesson list, instructor card, pricing comparison, enrollment
- **Subscription & Payments** — Free/Pro (₹499)/Enterprise (₹999) tiers, Razorpay integration, demo mode
- **User Dashboard** — Progress bars, streaks, XP, achievement badges, resume learning
- **Admin Dashboard** — Analytics (users, revenue, enrollments), user management
- **DRM Video Player** — Right-click disabled, DevTools detection, screen capture prevention, watermark overlay
- **UI/UX** — Skillo-inspired green palette, Playfair Display headings, frosted glass navbar, responsive design

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.10+

### Frontend
```bash
cd frontend
npm install
npm run dev
# → http://localhost:3001
```

### Backend
```bash
cd backend-fastapi
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8080 --reload
# → http://localhost:8080
# → Swagger docs: http://localhost:8080/docs
```

### Docker (Full Stack)
```bash
docker-compose up --build
# Frontend: http://localhost:3000
# Backend:  http://localhost:8080
# Postgres: localhost:5432
```

## Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@spire.dev | admin123 |
| Student | student@spire.dev | student123 |
| Instructor | arjun@spire.dev | password123 |
| Instructor | priya@spire.dev | password123 |
| Instructor | rahul@spire.dev | password123 |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login, returns JWT |
| GET | /api/courses/ | List all courses |
| GET | /api/courses/{id} | Course detail + lessons |
| POST | /api/enrollments/{course_id} | Enroll in course |
| POST | /api/subscriptions/create | Create Razorpay order |
| POST | /api/subscriptions/verify | Verify payment |
| GET | /api/subscriptions/status | Check subscription |
| GET | /api/user/profile | Current user profile |
| GET | /api/admin/analytics | Dashboard stats (admin) |
| GET | /api/admin/users | List users (admin) |

## Project Structure

```
Spire-Compet/
├── frontend/              # Next.js 14 App
│   ├── src/app/           # Pages (landing, courses, auth, dashboard, admin, pricing)
│   ├── src/components/    # UI, layout, home, courses, dashboard, player
│   ├── src/lib/           # API client, auth context, types, utils, mock data
│   └── tailwind.config.ts
├── backend-fastapi/       # FastAPI Backend
│   ├── app/api/           # Route handlers (auth, courses, users, subscriptions, admin)
│   ├── app/models/        # SQLAlchemy ORM models
│   ├── app/schemas/       # Pydantic v2 schemas
│   ├── app/core/          # Config, database, security (JWT + bcrypt)
│   └── app/services/      # Data seeder
├── backend/               # Spring Boot (legacy, kept for reference)
├── database/              # PostgreSQL schema.sql + seed.sql + setup guide
├── docker-compose.yml
└── README.md
```

## Environment Variables

### Frontend (`frontend/.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_RAZORPAY_KEY=rzp_test_xxx
```

### Backend (`backend-fastapi/.env`)
```
DATABASE_URL=sqlite:///./spire_dev.db
JWT_SECRET=your-secret-key
RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_KEY_SECRET=your-razorpay-secret
```

## Deployment

| Service | Platform |
|---------|----------|
| Frontend | Vercel |
| Backend | Railway |
| Database | Supabase (PostgreSQL) |
| Video Storage | AWS S3 + CloudFront |

## License

MIT
