# Architecture

## High-level overview

LJ CareerConnect is a classic three-tier MERN application:

```
React (Vite SPA)  <-- Axios/JSON -->  Express REST API  <-- Mongoose -->  MongoDB
                                              |
                                              +--> Cloudinary (files) or local /uploads
                                              +--> Gemini API or local deterministic AI engine
```

The frontend never talks to MongoDB, Cloudinary or Gemini directly — everything goes through the Express API, which is the only service holding secrets (`JWT_SECRET`, Cloudinary keys, `GEMINI_API_KEY`).

## Backend (`backend/src`)

```
config/         env.js (typed env access), db.js (Mongoose connection), cloudinary.js
models/         13 Mongoose schemas (see database-schema.md)
middleware/     auth (JWT + role guard), error handler, multer upload, express-validator glue, rate limiters
controllers/    one file per resource — request/response shaping, calls services/models
services/       ai.service.js (Gemini + fallback), storage.service.js (Cloudinary/local), notification.service.js, roleSkillMap.js
routes/         one router per resource, mounted under /api in routes/index.js
utils/          ApiError, ApiResponse, generateToken, matchScore, profileCompletion
validators/     express-validator chains for auth and job payloads
app.js          Express app: security middleware, routes, error handlers
server.js       connects to Mongo, starts the HTTP server
```

**Request lifecycle:** route → `protect` (JWT auth) → `authorize(...roles)` → validators → controller → model/service → `ApiResponse`. Errors thrown anywhere (via `ApiError` or Mongoose) are caught by `express-async-handler` and normalized by `middleware/error.middleware.js`.

**Why controllers call services instead of doing everything inline:** file upload (Cloudinary vs. local disk) and AI matching (Gemini vs. local engine) each have two implementations behind one interface. Controllers don't know or care which one is active — that decision lives entirely in `services/`.

## Frontend (`frontend/src`)

```
components/
  common/       Button-less* reusable UI: Modal, Pagination, StatusBadge, StatCard, Avatar, EmptyState...
  charts/       Recharts wrappers themed for the app (ChartCard, SimpleBarChart, TrendLineChart, DonutChart, FunnelStages)
  forms/        Field wrappers (TextField, SelectField, TextAreaField, FileDropzone)
  jobs/         JobCard, InternshipCard, JobFilters
  layout/       Sidebar, Topbar, NotificationBell, PublicNavbar/Footer, DashboardLayout
layouts/        StudentLayout, RecruiterLayout, AdminLayout, AuthLayout — each wraps <Outlet/>
pages/          public/, auth/, student/, recruiter/, admin/, shared/ (NotificationsPage reused by all 3 roles)
routes/         AppRoutes.jsx (route tree), ProtectedRoute.jsx (auth + role guard)
context/        AuthContext.jsx — user/profile/session state, login/register/logout
services/       one Axios-based module per backend resource (job.service.js, ai.service.js, ...)
hooks/          useFetch (generic async loader), useDebounce
utils/          constants.js, formatters.js, chartTheme.js
```

*Buttons are plain `<button>`/`<Link>` elements styled with Tailwind component classes (`.btn-primary`, `.btn-outline`, ...) defined in `index.css`, rather than a `<Button>` wrapper component — this keeps every button a native, fully-typed HTML element.

**Design system:** Tailwind CSS with a custom `ink` (charcoal), `paper` (ivory) and `brand` (emerald/teal) palette (`tailwind.config.js`), plus a shared component-class layer in `src/index.css` (`.card`, `.btn-*`, `.badge-*`, `.input`, `.table-base`, `.sidebar-link`). Every page composes the same primitives, which is what keeps ~50 pages visually consistent without a component library.

**Auth flow:** JWT is stored in `localStorage` under `lj_token`; `services/api.js`'s Axios interceptor attaches it to every request and redirects to `/login` on a 401. `AuthContext` bootstraps the session on load via `GET /api/auth/me`.

**Role-based routing:** `routes/AppRoutes.jsx` nests each role's routes under a `<ProtectedRoute roles={[...]}>` element; `ProtectedRoute` redirects unauthenticated users to `/login` and mismatched roles to `/unauthorized`.

## AI matching architecture

`backend/src/utils/matchScore.js` computes a **deterministic** match score (skill overlap + small bonuses for extra relevant skills and experience) — this score is used for job cards, application records and the AI Job Match feature, so students see the same number everywhere.

`backend/src/services/ai.service.js` wraps that deterministic core and, when `GEMINI_API_KEY` is configured, asks Gemini only for the *natural-language explanation* text (never for the score itself) — so scores stay reproducible even with AI enabled. `roleSkillMap.js` is a small local knowledge base of ~12 roles → core skills, used for Skill Gap Analysis and Career Recommendation in local/demo mode.

## File uploads

`middleware/upload.middleware.js` uses `multer.memoryStorage()` (never writes temp files to disk), then `services/storage.service.js` either streams the buffer to Cloudinary or writes it under `backend/uploads/<folder>/` and returns a URL served by Express's static middleware (`app.use('/uploads', ...)`). Controllers only ever see `{ url, publicId }` — they never know which backend is active.
