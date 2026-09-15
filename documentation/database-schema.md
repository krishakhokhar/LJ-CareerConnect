# Database Schema

MongoDB is schemaless at the database level; structure is enforced by Mongoose schemas in `backend/src/models/`. This document describes each collection and how they reference one another.

## Collections

### User (`users`)
Authentication record only — one per account, any role.
| Field | Type | Notes |
|---|---|---|
| email | String | unique, lowercase |
| password | String | bcrypt-hashed, `select: false` |
| role | String enum | `ADMIN` \| `STUDENT` \| `RECRUITER` |
| isActive | Boolean | toggled by admin to deactivate accounts |
| lastLoginAt | Date | |
| resetPasswordToken / resetPasswordExpire | String/Date | `select: false`, hashed reset token |

### StudentProfile (`studentprofiles`)
One per student user. `user` → `User._id` (unique).
Personal (fullName, dateOfBirth, gender, profilePhoto), academic (studentId unique, course, department, semester, graduationYear, cgpa), contact (phone, address, city, state), `experience[]` and `projects[]` (embedded subdocuments — small, always owned by exactly one profile), `resume` (resumeUrl, publicId, fileName, uploadedAt), `savedJobs[]` → `Job._id`, `profileCompletion` (0-100, recalculated on every profile/skill/cert/resume change), `isPlaced` (Boolean).

Skills and certifications are **not** embedded here — see below.

### Skill (`skills`)
One document per (student, skill) pair. `student` → `StudentProfile._id`. Fields: `name`, `category` (Programming/Frontend/Backend/Database/Tools/Soft Skills), `level` (Beginner/Intermediate/Advanced). Kept as its own collection (rather than embedded) so admin can run platform-wide aggregations (`GET /api/admin/skills-overview`) without scanning every profile.

### Certification (`certifications`)
One per certificate. `student` → `StudentProfile._id`. Fields: `name`, `organization`, `issueDate`, `credentialId`, `credentialUrl`, `fileUrl`/`filePublicId` (Cloudinary or local file).

### RecruiterProfile (`recruiterprofiles`)
One per recruiter user. `user` → `User._id` (unique), `company` → `Company._id`. Fields: `recruiterName`, `designation`, `officialEmail`, `phone`, `isApproved`.

### Company (`companies`)
`name` (unique), `logo`, `website`, `description`, `location`, `industry`, `size`, `isVerified` (admin-controlled badge), `createdBy` → `User._id`.

### Job (`jobs`)
`company` → `Company._id`, `postedBy` → `User._id` (recruiter). Full JD fields (`description`, `responsibilities[]`, `requirements[]`, `skills[]`, `qualification`, `experienceRequired`), logistics (`location`, `jobType`, `workMode`, `salaryMin/Max`, `openings`, `applicationDeadline`), `status` (DRAFT/PUBLISHED/CLOSED), `applicantsCount` (denormalized counter, incremented on each application).

### Application (`applications`)
`job` → `Job._id`, `student` → `StudentProfile._id`, `recruiter` → `User._id` (denormalized for fast recruiter-scoped queries). Unique compound index on `(job, student)` prevents duplicate applications. `status` enum walks a fixed flow (APPLIED → UNDER_REVIEW → SHORTLISTED → INTERVIEW → SELECTED, with REJECTED as a branch), auto-appended to `statusHistory[]` on every change via a pre-save hook. `matchScore`, `matchedSkills[]`, `missingSkills[]` are computed once at application time by `utils/matchScore.js`. `resumeUrl` is a snapshot of the resume at time of application.

### Interview (`interviews`)
`application` → `Application._id`, `job` → `Job._id`, `student` → `StudentProfile._id`, `recruiter` → `User._id`. Scheduling fields (`scheduledDate`, `scheduledTime`, `interviewType`, `meetingLink`, `location`, `round`), `status` (SCHEDULED/COMPLETED/CANCELLED), `feedback`.

### PlacementDrive (`placementdrives`)
`company` → `Company._id`, optional `job` → `Job._id`. `eligibility` (minCgpa, courses[], departments[], maxBacklogs, graduationYear[]) is checked client-side against the logged-in student's profile to compute `isEligible`. `registeredStudents[]` → `StudentProfile._id`.

### Internship (`internships`) & InternshipApplication (`internshipapplications`)
Mirrors Job/Application but kept as separate models because internships have different fields (`duration`, `stipend`, `isPaid`, `ppoOpportunity`) and a different application lifecycle (`APPLIED → ... → SELECTED/REJECTED/COMPLETED`, no interview stage) and support **document uploads** (`documents[]`) beyond the resume.

### Notification (`notifications`)
`recipient` → `User._id`, `title`, `message`, `type` (APPLICATION/INTERVIEW/JOB/DRIVE/INTERNSHIP/ANNOUNCEMENT/SYSTEM), `link` (frontend route), `isRead`. Indexed on `(recipient, createdAt)` for fast unread-feed queries.

### Alumni (`alumnis`)
Optional `student` → `StudentProfile._id` link (most seed alumni are historical records with no platform account). `name`, `graduationYear`, `course`, `department`, `company`, `jobRole`, `salaryPackage` (LPA), `employmentType`, `joiningDate`, `isDemoData` flag.

## Reference diagram

```
User 1───1 StudentProfile 1───* Skill
                          1───* Certification
                          *───* Job (savedJobs)
                          1───* Application ───* Interview
                          1───* InternshipApplication

User 1───1 RecruiterProfile *───1 Company 1───* Job
                                          1───* Internship
                                          1───* PlacementDrive

Application/Internship application → Interview/Notification fan out on status change
```

Every foreign key is a real Mongoose `ObjectId` ref (never a denormalized copy used for identity — only for read-performance, e.g. `Application.recruiter`), and `.populate()` is used throughout controllers rather than manual joins.
