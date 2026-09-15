# User Roles & Permissions

LJ CareerConnect has exactly three roles, stored on `User.role` and enforced on every protected route with `middleware/auth.middleware.js`: `protect` (verifies the JWT and loads `req.user`) followed by `authorize('ROLE', ...)` (rejects with 403 if `req.user.role` isn't in the allow-list).

## STUDENT

Self-registers at `/register` (role toggle → Student). Can:
- Build and edit their profile (personal, academic, contact, experience, projects), track profile completion.
- Manage skills and certifications (with file upload) as their own collections.
- Upload/replace/delete a PDF resume.
- Browse, search, filter and save jobs; see a deterministic AI match score per job.
- Apply to jobs and internships (blocked without a resume on file, and blocked from double-applying).
- Track application status on a visual timeline (Applied → Under Review → Shortlisted → Interview → Selected/Rejected).
- View and join scheduled interviews.
- Register for eligible placement drives.
- Use all three Career AI tools (Resume-Job Match, Skill Gap Analysis, Career Recommendation).
- Read and manage their own notifications.

Cannot: see other students' data, post/manage jobs, access any `/recruiter/*` or `/admin/*` route or API (`authorize('STUDENT')` on every student route rejects other roles; the frontend also blocks navigation via `ProtectedRoute`).

## RECRUITER

Self-registers at `/register` (role toggle → Recruiter), which also creates (or attaches to, if the company name matches) a `Company` record. Can:
- Edit their own recruiter profile and their company's public profile.
- Create, edit, publish, close and delete jobs and internships **they posted** — every recruiter route re-checks `job.postedBy.equals(req.user._id)` (or `internship.postedBy`) server-side, not just in the UI.
- View applicants only for their own jobs/internships, shortlist/reject them, and view resumes/profiles.
- Schedule and update interviews for their own applicants.
- See a hiring-funnel dashboard scoped to their own jobs only.

Cannot: see or modify another recruiter's jobs/applicants, access `/student/*` or `/admin/*`.

## ADMIN (Placement Officer)

Not self-service — created via the backend seed script (`npm run seed`, using `ADMIN_EMAIL`/`ADMIN_PASSWORD` from `.env`) so an admin account can never be created through a public form. Can:
- View institution-wide dashboards (placements, department/company breakdowns, salary analytics).
- View and activate/deactivate any student or recruiter account.
- Verify/unverify companies.
- View and delete any job, internship or application across the platform.
- Create and manage placement drives (auto-notifies every student on creation).
- Manage the alumni database and view alumni analytics.
- Send platform-wide (or role-targeted) announcements, which create a `Notification` for every matching user.
- View aggregate skills/certifications analytics across all students.

Admin routes use `router.use(protect, authorize('ADMIN'))` at the top of `backend/src/routes/admin.routes.js`, so every nested route inherits the same guard — there is no route under `/api/admin/*` that a non-admin JWT can reach.

## Cross-cutting rules

- A JWT encodes `{ id, role }` and expires after `JWT_EXPIRES_IN` (default 7 days); the frontend clears it and redirects to `/login` on any 401.
- Passwords are always hashed with bcrypt (`User` schema's `pre('save')` hook) and never returned by any API response (`select: false` on the field).
- Role is fixed at registration and cannot be changed via the profile-update endpoints — `updateMyProfile`/`updateProfile` controllers only accept an explicit allow-list of editable fields, so a client can't smuggle a `role` field into a PUT request.
