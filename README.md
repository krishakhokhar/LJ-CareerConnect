# LJ CareerConnect

A full-stack career and placement management platform connecting students, recruiters, and placement officers.

LJ CareerConnect is an AI-assisted placement platform built around six placement-and-career modules: Placement & Training Management, Job Posting & Application Tracking, the Company/Recruiter Portal, Internship Management, Skill Development & Certification, and Alumni Employment Tracking. Three roles — **Student**, **Recruiter**, and **Admin (Placement Officer)** — each get a dedicated, purpose-built dashboard.

## Repository

**GitHub:** [https://github.com/krishakhokhar/LJ-CareerConnect](https://github.com/krishakhokhar/LJ-CareerConnect)

## Project Overview

Students build a profile, get AI-matched to jobs/internships/placement drives, track every application on a visual status timeline, manage skills/certifications/resume, and get AI-powered career guidance. Recruiters post jobs and internships, review AI-ranked applicants, manage a hiring funnel, and schedule interviews. Admins get institution-wide analytics, manage students/recruiters/companies/placement drives/alumni, and broadcast announcements.

## Main Features

### Student Module
- Profile builder (personal, academic, contact, experience, projects) with a live profile-completion score
- Job portal: search, filter, sort, save jobs, and see a deterministic AI match score per job
- Apply to jobs and internships with a submitted resume + cover note; duplicate applications are blocked
- Application tracking on a visual status timeline (Applied → Under Review → Shortlisted → Interview → Selected/Rejected)
- Interview view: upcoming/past interviews with meeting links, round info, and status
- Placement drive discovery with eligibility checks and one-click registration
- Skills & certifications management (with file upload) and resume management (upload/replace/delete)
- Career AI tools: resume-job match, skill gap analysis, career recommendations
- Notification center

### Recruiter Module
- Company profile management
- Job and internship posting, editing, publishing/closing, and deletion (scoped to the recruiter's own postings)
- Applicant review: AI match scores, resumes, profiles, shortlist/reject actions
- Interview scheduling and status/feedback updates
- Recruiter dashboard: active jobs, applicants, shortlisted, interviews, selected, hiring funnel, and per-job application charts

### Admin / Placement Officer Module
- Institution-wide dashboard: students, recruiters, companies, active jobs, applications, placements, internships, department-wise placement %, company-wise hiring, monthly application trends, salary analytics
- Student and recruiter account management (activate/deactivate)
- Company verification
- Placement drive creation and management (auto-notifies every student)
- Alumni database management with employment analytics
- Platform-wide skills & certifications overview
- Reports (placement ratio, alumni counts, drive counts)
- Role-targeted announcements/notifications

### Job Management
Full CRUD for job postings (title, description, responsibilities, requirements, skills, qualification, experience, location, type, work mode, salary range, openings, deadline) with draft/published/closed status.

### Internship Management
Separate internship model with duration, stipend, paid/unpaid, PPO-opportunity flag, and a dedicated application flow that supports supporting-document uploads beyond the resume.

### Application Tracking
A single, deterministic AI match score (skill overlap + experience signal) computed once at application time, plus a full status-change history per application.

### Interview Management
Recruiter-scheduled interviews (online/in-person/telephonic) linked to a specific application, with student-facing upcoming-interview views and recruiter-facing status/feedback updates.

### Skills & Certifications
Skills and certifications are stored as their own collections (not just embedded profile fields), enabling platform-wide analytics (skills by category, proficiency levels, top skills, recent certifications) in the admin dashboard.

### Alumni Employment Tracking
Historical alumni employment records (company, role, package, employment type, joining date) with analytics by graduation year, company, and department.

### AI Resume-Job Matching
A deterministic skill-overlap scoring engine (`backend/src/utils/matchScore.js`) that always returns the same score for the same inputs — used consistently across job cards, applications, and the AI Job Match tool.

### AI Skill Gap Analysis
Compares a student's current skills against a target role's core skill set (from a local role→skills knowledge base) to produce a readiness percentage, matched skills, skill gap, and learning priorities.

### Career Recommendations
Scores a student's profile against ~12 common tech/career roles and returns the top matches with an AI-generated (or locally-templated) insight paragraph.

> All three AI features run through `backend/src/services/ai.service.js`, which calls the Gemini API when `GEMINI_API_KEY` is configured and **automatically falls back to a fully-functional local deterministic engine when it isn't** — the app always works, with or without an AI key.

### Notifications
In-app notification center per user (applications, interviews, new jobs, placement drives, internship updates, admin announcements) with unread counts and mark-as-read/delete actions.

## Tech Stack

**Frontend:** React, Vite, JavaScript, Tailwind CSS, React Router DOM, Axios, Recharts, Lucide React, React Hot Toast
**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT authentication, bcryptjs, Multer
**File storage:** Cloudinary (falls back to local disk storage under `backend/uploads` when not configured)
**AI:** Gemini API (optional — local deterministic fallback engine included)

Explicitly **not** used: Firebase, Bootstrap, Material UI, Ant Design.

## Folder Structure

```
LJ-CareerConnect/
├── frontend/                  React + Vite SPA
│   ├── src/
│   │   ├── components/        common/ charts/ forms/ jobs/ layout/
│   │   ├── layouts/           StudentLayout, RecruiterLayout, AdminLayout, AuthLayout
│   │   ├── pages/              public/ auth/ student/ recruiter/ admin/ shared/
│   │   ├── routes/             AppRoutes.jsx, ProtectedRoute.jsx
│   │   ├── context/            AuthContext.jsx
│   │   ├── services/           one Axios module per backend resource
│   │   ├── hooks/, utils/
│   ├── vercel.json             SPA rewrite config for Vercel
│   └── .env.example
├── backend/                    Express REST API
│   ├── src/
│   │   ├── config/, models/, middleware/, controllers/, services/, routes/, utils/, validators/
│   │   ├── app.js, server.js
│   ├── seed/                   demo data generator
│   ├── uploads/                local file storage fallback
│   └── .env.example
├── documentation/               architecture, database schema, API reference, setup guide, user roles
├── database/                    MongoDB schema notes (schemaless DB — see documentation/)
├── .gitignore
└── README.md
```

See [`documentation/architecture.md`](documentation/architecture.md) for the full backend/frontend breakdown.

## Local Setup

### Prerequisites
- Node.js 18+
- MongoDB (local install or a free MongoDB Atlas cluster)
- Optional: a Cloudinary account, a Gemini API key

### Install & run

```bash
# Backend
cd backend
npm install
cp .env.example .env       # fill in MONGO_URI and JWT_SECRET at minimum
npm run seed                # creates the admin account + demo data
npm run dev                  # http://localhost:5000

# Frontend (new terminal)
cd frontend
npm install
cp .env.example .env        # VITE_API_URL defaults to http://localhost:5000/api
npm run dev                   # http://localhost:5173
```

## Environment Variables

Real values live only in local, gitignored `.env` files — never commit them. `.env.example` files in both `backend/` and `frontend/` hold placeholders only.

### `backend/.env`

```
PORT=5000
NODE_ENV=development
MONGO_URI=
JWT_SECRET=
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
GEMINI_API_KEY=
CLIENT_URL=
ADMIN_EMAIL=
ADMIN_PASSWORD=
```

| Variable | Required | Notes |
|---|---|---|
| `PORT` | No | Defaults to 5000 |
| `MONGO_URI` | Yes | Local or Atlas connection string |
| `JWT_SECRET` | Yes | Long random string signing auth tokens |
| `CLOUDINARY_*` | No | Enables persistent file storage; without it, uploads are stored under `backend/uploads` |
| `GEMINI_API_KEY` | No | Enables live Gemini responses; without it, a local deterministic AI engine handles all AI features |
| `CLIENT_URL` | Yes | Your deployed frontend origin, used for CORS |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Used by `npm run seed` only | Never hardcoded in application code |

### `frontend/.env`

```
VITE_API_URL=
```

Point this at your backend's `/api` URL — `http://localhost:5000/api` locally, `https://your-backend.onrender.com/api` in production. The frontend never depends on a hardcoded `localhost` URL at build time; if `VITE_API_URL` is unset it falls back to the local-dev default only.

## MongoDB Setup

- **Local:** install MongoDB Community Server, use `mongodb://127.0.0.1:27017/lj_careerconnect`.
- **Atlas (recommended for deployment):** create a free cluster, add a database user, allow your deployment's IP (or `0.0.0.0/0` for simplicity), and use the provided `mongodb+srv://` connection string as `MONGO_URI`. The database name (`lj_careerconnect`) is also enforced in code (`backend/src/config/db.js`), so it's used regardless of what's in the URI's path segment.

## Deployment

### Backend deployment (e.g. Render)

1. Push this repository to GitHub (see below).
2. Create a new Web Service on Render, pointing at this repo with root directory `backend`.
3. Build command: `npm install`. Start command: `npm start`.
4. Set environment variables in Render's dashboard: `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL` (your deployed frontend URL), `CLOUDINARY_*`, `GEMINI_API_KEY`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`. Never commit these — set them directly in the host's environment config.
5. Once deployed, verify `https://your-backend.onrender.com/api/health` responds.
6. Run `npm run seed` once (e.g. via Render's shell) to create the admin account and demo data against the production database.

### Frontend deployment (e.g. Vercel)

1. Import this repository into Vercel with root directory `frontend`.
2. Framework preset: Vite. Build command: `npm run build`. Output directory: `dist`.
3. Set the environment variable `VITE_API_URL` to your deployed backend's `/api` URL (e.g. `https://your-backend.onrender.com/api`).
4. `frontend/vercel.json` already includes the SPA rewrite (`/(.*) -> /index.html`) so client-side routes (React Router) work correctly on refresh/direct navigation.
5. Deploy, then update the backend's `CLIENT_URL` env var to match this Vercel URL and redeploy the backend so CORS allows it.

## Documentation

- [`documentation/architecture.md`](documentation/architecture.md)
- [`documentation/database-schema.md`](documentation/database-schema.md)
- [`documentation/api-documentation.md`](documentation/api-documentation.md)
- [`documentation/setup-guide.md`](documentation/setup-guide.md)
- [`documentation/user-roles.md`](documentation/user-roles.md)
- [`backend/README.md`](backend/README.md) — backend-specific quick start and MongoDB troubleshooting

## Demo Data Disclaimer

Data created by `npm run seed` (students, recruiters, companies, jobs, alumni, etc.) is fictional demo data for development and demonstration only — it does not represent real companies' current vacancies or real people.
