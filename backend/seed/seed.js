/* eslint-disable no-console */
require('dotenv').config();
const mongoose = require('mongoose');
const env = require('../src/config/env');
const connectDB = require('../src/config/db');

const User = require('../src/models/User');
const StudentProfile = require('../src/models/StudentProfile');
const RecruiterProfile = require('../src/models/RecruiterProfile');
const Company = require('../src/models/Company');
const Job = require('../src/models/Job');
const Application = require('../src/models/Application');
const Interview = require('../src/models/Interview');
const PlacementDrive = require('../src/models/PlacementDrive');
const Internship = require('../src/models/Internship');
const InternshipApplication = require('../src/models/InternshipApplication');
const Skill = require('../src/models/Skill');
const Certification = require('../src/models/Certification');
const Notification = require('../src/models/Notification');
const Alumni = require('../src/models/Alumni');

const calculateProfileCompletion = require('../src/utils/profileCompletion');
const calculateMatchScore = require('../src/utils/matchScore');

const {
  DEMO_RESUME_URL,
  COMPANIES,
  DEPARTMENTS,
  COURSES,
  FIRST_NAMES,
  LAST_NAMES,
  SKILL_POOL,
  CERT_TEMPLATES,
  JOB_TEMPLATES,
  INTERNSHIP_TEMPLATES,
  ALUMNI_TEMPLATES,
} = require('./seedData');

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pickMany = (arr, count) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
const daysFromNow = (days) => new Date(Date.now() + days * 24 * 60 * 60 * 1000);

const STUDENT_COUNT = 24;
const ALL_STATUSES = ['APPLIED', 'UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEW', 'SELECTED', 'REJECTED'];

const destroy = async () => {
  await Promise.all([
    User.deleteMany({}),
    StudentProfile.deleteMany({}),
    RecruiterProfile.deleteMany({}),
    Company.deleteMany({}),
    Job.deleteMany({}),
    Application.deleteMany({}),
    Interview.deleteMany({}),
    PlacementDrive.deleteMany({}),
    Internship.deleteMany({}),
    InternshipApplication.deleteMany({}),
    Skill.deleteMany({}),
    Certification.deleteMany({}),
    Notification.deleteMany({}),
    Alumni.deleteMany({}),
  ]);
  console.log('All collections cleared.');
};

const seed = async () => {
  console.log('Connecting to MongoDB...');
  await connectDB(); // shared connection logic: correct dbName, timeouts, retries, and never logs the credentials

  await destroy();

  // 1. Admin
  await User.create({ email: env.ADMIN_EMAIL, password: env.ADMIN_PASSWORD, role: 'ADMIN' });
  console.log(`Admin created: ${env.ADMIN_EMAIL} / ${env.ADMIN_PASSWORD}`);

  // 2. Companies
  const companies = await Company.insertMany(
    COMPANIES.map((c) => ({ ...c, isVerified: true }))
  );
  console.log(`${companies.length} companies created.`);

  // 3. Recruiters (one per company, official email pattern)
  const recruiters = [];
  for (const company of companies) {
    const slug = company.name.toLowerCase().replace(/[^a-z]/g, '');
    const user = await User.create({
      email: `hr@${slug}-demo.com`,
      password: 'Recruiter@123',
      role: 'RECRUITER',
    });
    const profile = await RecruiterProfile.create({
      user: user._id,
      recruiterName: `${rand(FIRST_NAMES)} ${rand(LAST_NAMES)}`,
      designation: 'Talent Acquisition Specialist',
      officialEmail: user.email,
      phone: `9${randInt(100000000, 999999999)}`,
      company: company._id,
    });
    recruiters.push({ user, profile, company });
  }
  console.log(`${recruiters.length} recruiters created.`);

  // 4. Jobs (2-3 per company from JOB_TEMPLATES, cycled)
  const jobs = [];
  let templateIndex = 0;
  for (const r of recruiters) {
    const jobCount = randInt(1, 2);
    for (let i = 0; i < jobCount; i += 1) {
      const tpl = JOB_TEMPLATES[templateIndex % JOB_TEMPLATES.length];
      templateIndex += 1;
      const job = await Job.create({
        title: tpl.title,
        company: r.company._id,
        postedBy: r.user._id,
        description: tpl.description,
        responsibilities: tpl.responsibilities,
        requirements: tpl.requirements,
        skills: tpl.skills,
        qualification: tpl.qualification,
        experienceRequired: tpl.jobType === 'Internship' ? 'Freshers welcome' : '0-2 years',
        location: r.company.location,
        jobType: tpl.jobType,
        workMode: tpl.workMode,
        salaryMin: tpl.salaryMin,
        salaryMax: tpl.salaryMax,
        openings: randInt(1, 5),
        applicationDeadline: daysFromNow(randInt(10, 45)),
        status: 'PUBLISHED',
      });
      jobs.push(job);
    }
  }
  console.log(`${jobs.length} jobs created.`);

  // 5. Internships (across a few companies)
  const internships = [];
  for (let i = 0; i < INTERNSHIP_TEMPLATES.length; i += 1) {
    const tpl = INTERNSHIP_TEMPLATES[i];
    const r = recruiters[i % recruiters.length];
    const internship = await Internship.create({
      title: tpl.title,
      company: r.company._id,
      postedBy: r.user._id,
      description: `Hands-on internship opportunity focused on ${tpl.title.replace(' Intern', '').toLowerCase()} at ${r.company.name}.`,
      skills: tpl.skills,
      duration: tpl.duration,
      location: r.company.location,
      workMode: rand(['On-site', 'Remote', 'Hybrid']),
      stipend: tpl.stipend,
      isPaid: true,
      openings: randInt(1, 4),
      applicationDeadline: daysFromNow(randInt(10, 30)),
      ppoOpportunity: Math.random() > 0.5,
      status: 'PUBLISHED',
    });
    internships.push(internship);
  }
  console.log(`${internships.length} internships created.`);

  // 6. Students with skills, certifications, resume
  const students = [];
  for (let i = 0; i < STUDENT_COUNT; i += 1) {
    const firstName = rand(FIRST_NAMES);
    const lastName = rand(LAST_NAMES);
    const fullName = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@student-demo.com`;
    const department = rand(DEPARTMENTS);
    const course = rand(COURSES);

    const user = await User.create({ email, password: 'Student@123', role: 'STUDENT' });

    const hasResume = Math.random() > 0.15;
    const profile = await StudentProfile.create({
      user: user._id,
      fullName,
      dateOfBirth: new Date(2001 + randInt(0, 4), randInt(0, 11), randInt(1, 28)),
      gender: rand(['Male', 'Female']),
      studentId: `LJ${2021 + randInt(0, 3)}${String(1000 + i)}`,
      course,
      department,
      semester: randInt(3, 8),
      graduationYear: 2025 + randInt(0, 2),
      cgpa: Math.round(randInt(60, 95)) / 10,
      phone: `9${randInt(100000000, 999999999)}`,
      address: `${randInt(1, 200)}, Sector ${randInt(1, 20)}`,
      city: 'Ahmedabad',
      state: 'Gujarat',
      experience: Math.random() > 0.6 ? [{
        title: 'Web Development Intern',
        organization: rand(COMPANIES).name,
        type: 'Internship',
        startDate: daysFromNow(-180),
        endDate: daysFromNow(-90),
        isCurrent: false,
        description: 'Worked on building and maintaining features for an internal web application.',
      }] : [],
      projects: [{
        title: rand(['Campus Placement Portal', 'E-Commerce Website', 'Task Manager App', 'Expense Tracker', 'Chat Application']),
        description: 'A full-stack web application built as part of academic coursework and personal learning.',
        techStack: pickMany(SKILL_POOL.map((s) => s.name), 3),
        projectUrl: '',
        repoUrl: '',
      }],
      resume: hasResume ? { resumeUrl: DEMO_RESUME_URL, publicId: 'demo:placeholder', fileName: 'resume.pdf', uploadedAt: new Date() } : {},
      linkedinUrl: '',
      githubUrl: '',
    });

    const skillCount = randInt(4, 8);
    const chosenSkills = pickMany(SKILL_POOL, skillCount);
    const skillDocs = await Skill.insertMany(
      chosenSkills.map((s) => ({
        student: profile._id,
        name: s.name,
        category: s.category,
        level: rand(['Beginner', 'Intermediate', 'Advanced']),
      }))
    );

    let certDocs = [];
    if (Math.random() > 0.4) {
      const certTpl = rand(CERT_TEMPLATES);
      certDocs = await Certification.insertMany([{
        student: profile._id,
        name: certTpl.name,
        organization: certTpl.organization,
        issueDate: daysFromNow(-randInt(30, 400)),
        credentialId: `CRED-${randInt(10000, 99999)}`,
      }]);
    }

    profile.profileCompletion = calculateProfileCompletion({
      ...profile.toObject(),
      skills: skillDocs,
      certifications: certDocs,
    });
    await profile.save();

    students.push({ user, profile, skills: skillDocs });
  }
  console.log(`${students.length} students created.`);

  // 7. Applications (each student with resume applies to 1-4 jobs)
  const applications = [];
  for (const s of students) {
    if (!s.profile.resume?.resumeUrl) continue;
    const applyJobs = pickMany(jobs, randInt(1, 4));
    const studentSkillNames = s.skills.map((sk) => sk.name);

    for (const job of applyJobs) {
      const { score, matchedSkills, missingSkills } = calculateMatchScore(studentSkillNames, job.skills, {
        studentExperienceCount: s.profile.experience?.length || 0,
      });
      const status = rand(ALL_STATUSES);
      try {
        const application = await Application.create({
          job: job._id,
          student: s.profile._id,
          recruiter: job.postedBy,
          status,
          matchScore: score,
          matchedSkills,
          missingSkills,
          resumeUrl: s.profile.resume.resumeUrl,
          coverNote: 'I am excited to apply for this position and believe my skills make me a strong fit.',
        });
        applications.push(application);
        job.applicantsCount += 1;

        if (status === 'SELECTED') {
          s.profile.isPlaced = true;
          await s.profile.save();
        }
      } catch (e) {
        // duplicate application guard (unique index) - skip silently
      }
    }
  }
  await Promise.all(jobs.map((j) => j.save()));
  console.log(`${applications.length} applications created.`);

  // 8. Interviews for applications in INTERVIEW/SELECTED stage
  const interviewApps = applications.filter((a) => ['INTERVIEW', 'SELECTED'].includes(a.status));
  let interviewCount = 0;
  for (const app of interviewApps) {
    const job = jobs.find((j) => j._id.equals(app.job));
    await Interview.create({
      application: app._id,
      job: app.job,
      student: app.student,
      recruiter: app.recruiter,
      scheduledDate: daysFromNow(randInt(-10, 15)),
      scheduledTime: `${randInt(10, 17)}:${rand(['00', '30'])} ${rand(['AM', 'PM'])}`,
      interviewType: rand(['Online', 'In-person', 'Telephonic']),
      meetingLink: 'https://meet.demo.example.com/interview-room',
      location: job ? job.location : '',
      round: rand(['Round 1 - Technical', 'Round 2 - HR', 'Final Round']),
      status: app.status === 'SELECTED' ? 'COMPLETED' : rand(['SCHEDULED', 'COMPLETED']),
    });
    interviewCount += 1;
  }
  console.log(`${interviewCount} interviews created.`);

  // 9. Placement Drives
  let driveCount = 0;
  for (let i = 0; i < 6; i += 1) {
    const r = recruiters[i % recruiters.length];
    const relatedJob = jobs.find((j) => j.company.equals(r.company._id));
    const driveMode = rand(['Online', 'On-campus']);
    await PlacementDrive.create({
      company: r.company._id,
      driveName: `${r.company.name} Campus Drive ${2025 + Math.floor(i / recruiters.length)}`,
      jobRole: relatedJob ? relatedJob.title : 'Software Engineer',
      job: relatedJob?._id,
      driveDate: daysFromNow(randInt(-5, 40)),
      driveTime: '10:00 AM',
      mode: driveMode,
      venue: driveMode === 'On-campus' ? 'LJ University Auditorium' : 'Online - Google Meet',
      eligibility: {
        minCgpa: rand([5, 6, 6.5, 7]),
        courses: pickMany(COURSES, 2),
        departments: pickMany(DEPARTMENTS, 2),
        maxBacklogs: 0,
        graduationYear: [2025, 2026],
      },
      requiredSkills: relatedJob ? relatedJob.skills : ['JavaScript', 'Communication'],
      salaryPackage: `${randInt(4, 12)} LPA`,
      openings: randInt(2, 10),
      applicationDeadline: daysFromNow(randInt(5, 30)),
      description: `${r.company.name} is visiting campus to hire for the ${relatedJob ? relatedJob.title : 'Software Engineer'} role. Eligible students are encouraged to register.`,
      status: rand(['UPCOMING', 'ONGOING']),
      createdBy: null,
      registeredStudents: pickMany(students, randInt(3, 10)).map((s) => s.profile._id),
    });
    driveCount += 1;
  }
  console.log(`${driveCount} placement drives created.`);

  // 10. Alumni
  const alumniDocs = ALUMNI_TEMPLATES.map((a, i) => ({
    name: `${rand(FIRST_NAMES)} ${rand(LAST_NAMES)}`,
    graduationYear: 2019 + (i % 6),
    course: rand(COURSES),
    department: rand(DEPARTMENTS),
    company: a.company,
    jobRole: a.jobRole,
    salaryPackage: a.salaryPackage,
    employmentType: 'Full-time',
    joiningDate: new Date(2019 + (i % 6), randInt(0, 11), randInt(1, 28)),
    isDemoData: true,
  }));
  await Alumni.insertMany(alumniDocs);
  console.log(`${alumniDocs.length} alumni records created.`);

  // 11. Sample notifications for the first student and first recruiter
  if (students[0]) {
    await Notification.insertMany([
      { recipient: students[0].user._id, title: 'Welcome to LJ CareerConnect', message: 'Complete your profile to unlock better job matches.', type: 'SYSTEM' },
      { recipient: students[0].user._id, title: 'New job matching your skills', message: 'A new Frontend Developer role was posted that matches your profile.', type: 'JOB', link: '/student/jobs' },
    ]);
  }
  if (recruiters[0]) {
    await Notification.insertMany([
      { recipient: recruiters[0].user._id, title: 'Welcome to LJ CareerConnect', message: 'Post your first job to start receiving applications.', type: 'SYSTEM' },
    ]);
  }

  console.log('\nSeed complete!');
  console.log('----------------------------------------');
  console.log(`Admin login:     ${env.ADMIN_EMAIL} / ${env.ADMIN_PASSWORD}`);
  console.log(`Student login:   ${students[0].user.email} / Student@123`);
  console.log(`Recruiter login: ${recruiters[0].user.email} / Recruiter@123`);
  console.log('----------------------------------------');

  await mongoose.disconnect();
  process.exit(0);
};

const SEED_RETRY_ATTEMPTS = 3;
const SEED_RETRY_DELAY_MS = 5000;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Retries the entire seed run, not just the initial connect. A network path
 * this flaky can drop a write mid-run even after connecting successfully
 * (observed directly: connect succeeded, then destroy()'s deleteMany calls
 * still hit an ETIMEDOUT) - so on failure this disconnects, waits, and reruns
 * seed() from scratch (which clears + repopulates everything), rather than
 * leaving a half-seeded database.
 */
const runWithRetries = async (fn, label) => {
  for (let attempt = 1; attempt <= SEED_RETRY_ATTEMPTS; attempt += 1) {
    try {
      await fn();
      return;
    } catch (err) {
      const isLastAttempt = attempt === SEED_RETRY_ATTEMPTS;
      console.error(`\n${label} attempt ${attempt}/${SEED_RETRY_ATTEMPTS} failed: ${err.message}`);
      await mongoose.disconnect().catch(() => {});

      if (isLastAttempt) {
        console.error(`\n${label} did not succeed after ${SEED_RETRY_ATTEMPTS} attempts.`);
        console.error('See backend/README.md -> "Troubleshooting MongoDB connectivity" for how to diagnose this.');
        process.exit(1);
      }
      console.log(`Retrying in ${(SEED_RETRY_DELAY_MS * attempt) / 1000}s...`);
      await sleep(SEED_RETRY_DELAY_MS * attempt);
    }
  }
};

if (process.argv.includes('--destroy')) {
  runWithRetries(async () => {
    await connectDB();
    await destroy();
    await mongoose.disconnect();
  }, 'Destroy').then(() => process.exit(0));
} else {
  runWithRetries(seed, 'Seed');
}
