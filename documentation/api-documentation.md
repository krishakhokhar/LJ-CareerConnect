# API Documentation

Base URL: `http://localhost:5000/api` (or `VITE_API_URL` in production).

All responses follow one envelope shape:
```json
{ "success": true, "message": "...", "data": { } }
```
Errors: `{ "success": false, "message": "...", "errors": [] }` with an appropriate HTTP status code.

**Auth header:** `Authorization: Bearer <token>` — required on every route below except `/auth/register/*`, `/auth/login`, `/auth/forgot-password`, `/auth/reset-password`.

---

## Auth — `/api/auth`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/register/student` | Public | Create a student account + profile, returns `{ token, user, profile }` |
| POST | `/register/recruiter` | Public | Create a recruiter account (+ company if new), returns `{ token, user, profile }` |
| POST | `/login` | Public | `{ email, password }` → `{ token, user, profile }` |
| GET | `/me` | Any | Current session's `{ user, profile }` |
| POST | `/forgot-password` | Public | `{ email }` — generates a reset token; in non-production, returns `resetUrl` directly since no email service is configured |
| POST | `/reset-password` | Public | `{ token, password }` |
| POST | `/logout` | Any | No-op (JWT is stateless — client discards the token) |

## Jobs — `/api/jobs`

| Method | Path | Role | Description |
|---|---|---|---|
| GET | `/` | Any | List jobs — query: `search, jobType, location, minSalary, skills, company, sort, page, limit, status`. Students get `aiMatchScore` per job; recruiters see only their own; admins see all. |
| GET | `/saved/list` | STUDENT | The student's saved jobs |
| POST | `/` | RECRUITER | Create a job for the recruiter's company |
| GET | `/:id` | Any | Job detail + `aiMatchScore`, `hasApplied`, `isSaved` for students |
| PUT | `/:id` | RECRUITER (owner) / ADMIN | Update a job |
| DELETE | `/:id` | RECRUITER (owner) / ADMIN | Delete a job (cascades its applications) |
| PATCH | `/:id/status` | RECRUITER (owner) / ADMIN | `{ status: DRAFT\|PUBLISHED\|CLOSED }` |
| POST | `/:id/save` | STUDENT | Toggle save |
| POST | `/:id/apply` | STUDENT | `{ coverNote }` — blocked without a resume or on a duplicate application |

## Applications — `/api/applications`

| Method | Path | Role | Description |
|---|---|---|---|
| GET | `/` | Any | Role-scoped list (own applications / own jobs' applications / all) — query: `status, jobId, page, limit` |
| GET | `/:id` | Any (owner-checked) | Full application detail |
| PUT | `/:id/status` | RECRUITER (owner) / ADMIN | `{ status, note }` — appends to `statusHistory`, notifies the student, marks the profile `isPlaced` on `SELECTED` |

## Students — `/api/students` (all STUDENT-only)

| Method | Path | Description |
|---|---|---|
| GET | `/profile` | Full profile incl. skills & certifications, recalculates `profileCompletion` |
| PUT | `/profile` | Update personal/academic/contact/experience/projects fields |
| GET | `/dashboard` | Stats, recent applications, upcoming interviews, recommended jobs, chart data |

## Skills — `/api/skills` (STUDENT-only) · Certifications — `/api/certifications` (STUDENT-only)

Standard CRUD: `GET /`, `POST /` (certifications accept `multipart/form-data` with a `certificate` file field), `PUT /:id` (skills only), `DELETE /:id`.

## Resume — `/api/resume` (STUDENT-only)

| Method | Path | Description |
|---|---|---|
| POST | `/upload` | `multipart/form-data`, field `resume`, PDF only, 5MB max |
| DELETE | `/` | Removes the current resume |

## Recruiters — `/api/recruiters` (all RECRUITER-only)

`GET /profile`, `PUT /profile` (updates recruiter + nested `company` object), `GET /dashboard` (stats + applicationsPerJob/hiringFunnel/applicationStatus charts), `GET /applicants` (query: `jobId, status, page, limit`).

## Interviews — `/api/interviews`

| Method | Path | Role | Description |
|---|---|---|---|
| GET | `/` | Any | Role-scoped list — query: `status, upcoming=true` |
| POST | `/` | RECRUITER | `{ applicationId, scheduledDate, scheduledTime, interviewType, meetingLink, location, notes, round }` — advances the application to `INTERVIEW` and notifies the student |
| PUT | `/:id` | RECRUITER (owner) | Update schedule/status/feedback |

## Placement Drives — `/api/placement-drives`

`GET /` (students get `isEligible`/`isRegistered` flags computed against their profile), `GET /:id`, `POST /` (ADMIN — notifies every student), `PUT /:id` / `DELETE /:id` (ADMIN), `POST /:id/register` (STUDENT).

## Internships — `/api/internships`

Mirrors Jobs: `GET /`, `POST /` (RECRUITER), `GET /:id`, `PUT /:id` / `DELETE /:id` (owner/ADMIN), `POST /:id/apply` (STUDENT), `GET /:id/applicants` (owner/ADMIN). Plus:
- `GET /my/applications` (STUDENT) — the student's internship applications
- `PUT /applications/:id/status` (RECRUITER/ADMIN)
- `POST /applications/:id/documents` (STUDENT, `multipart/form-data`, field `certificate`) — uploads a supporting document to an internship application

## AI Career — `/api/ai` (all STUDENT-only, rate-limited)

| Method | Path | Body | Description |
|---|---|---|---|
| GET | `/status` | — | `{ provider: 'gemini' \| 'local-demo' }` |
| GET | `/roles` | — | List of roles the local knowledge base supports |
| POST | `/job-match` | `{ jobId }` | Match score, matched/missing/recommended skills, explanation |
| POST | `/skill-gap` | `{ targetRole }` | Readiness %, matched skills, skill gap, learning priorities |
| POST | `/career-recommendation` | — | Top 4 role matches with scores + an insight paragraph |

## Alumni — `/api/alumni`

`GET /` (any, query: `search, department, graduationYear, page, limit`), `GET /analytics` (any), `POST /` / `PUT /:id` / `DELETE /:id` (ADMIN).

## Notifications — `/api/notifications`

`GET /` (query: `page, limit, unreadOnly`), `PUT /:id/read`, `PUT /read-all`, `DELETE /:id`, `POST /announcement` (ADMIN — `{ title, message, audience: 'ALL'|'STUDENT'|'RECRUITER' }`, broadcasts to every matching user).

## Companies — `/api/companies`

`GET /` (query: `search`), `GET /:id` (+ `activeJobs` count), `PUT /:id` / `DELETE /:id` (ADMIN).

## Admin — `/api/admin` (all ADMIN-only)

`GET /dashboard`, `GET /students` / `PUT /students/:id/status`, `GET /recruiters` / `PUT /recruiters/:id/status`, `PUT /companies/:id/verify`, `GET /reports`, `GET /skills-overview`.
