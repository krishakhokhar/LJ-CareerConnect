# Setup Guide

Step-by-step local setup. See the root `README.md` for a condensed version.

## Prerequisites

- Node.js 18+ and npm
- MongoDB running locally, or a free MongoDB Atlas cluster
- (Optional) A Cloudinary account for persistent file storage
- (Optional) A Gemini API key for live AI responses

## 1. Clone / open the project

```bash
cd LJ-CareerConnect
```

## 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
- Set `MONGO_URI` to your local or Atlas connection string.
- Set `JWT_SECRET` to any long random string (e.g. generate one with `openssl rand -hex 32`).
- Leave `CLOUDINARY_*` and `GEMINI_API_KEY` blank to run fully in local/demo mode, or fill them in — see the root README's Cloudinary/Gemini sections.
- Adjust `ADMIN_EMAIL` / `ADMIN_PASSWORD` if you want different seeded admin credentials.

Seed demo data (creates the admin account, companies, recruiters, students, jobs, applications, internships, placement drives and alumni):

```bash
npm run seed
```

Start the API:

```bash
npm run dev
```

You should see:
```
MongoDB connected: 127.0.0.1/lj-careerconnect
LJ CareerConnect API running on port 5000 [development]
```

Verify it's alive: open `http://localhost:5000/api/health`.

## 3. Frontend setup

In a new terminal:

```bash
cd frontend
npm install
cp .env.example .env
```

`VITE_API_URL` defaults to `http://localhost:5000/api`, which matches the backend's default port — no changes needed for local dev.

```bash
npm run dev
```

Open `http://localhost:5173`.

## 4. Log in

Use the credentials printed by `npm run seed`, or register a new student/recruiter account from the UI. The admin account is seed-only and cannot be created through the public registration form.

## 5. Common issues

| Symptom | Fix |
|---|---|
| `MongoDB connection error` on backend start | Confirm `MONGO_URI` is correct and MongoDB is running / your Atlas IP allow-list includes your machine |
| Frontend requests fail with CORS errors | Confirm `CLIENT_URL` in `backend/.env` matches the frontend's actual origin |
| File uploads fail | Without Cloudinary configured, files are stored under `backend/uploads/` — confirm that directory is writable. With Cloudinary configured, double-check all three `CLOUDINARY_*` values |
| Career AI feels "generic" | This is expected without `GEMINI_API_KEY` — the local deterministic engine still returns real scores and skill gaps, just without Gemini's generated prose |
| 401 errors immediately after login | Check `JWT_SECRET` is set consistently (don't change it between requests in the same session) |

## 6. Production build

```bash
cd frontend
npm run build     # outputs frontend/dist
npm run preview   # optional local preview of the production build
```

Deploy `frontend/dist` as a static site, and the `backend/` folder as a Node service (`npm start` runs `node src/server.js`). Set all environment variables on the host — never commit `.env` files (see `.gitignore`).
