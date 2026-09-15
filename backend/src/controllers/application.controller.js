const asyncHandler = require('express-async-handler');
const Application = require('../models/Application');
const Job = require('../models/Job');
const StudentProfile = require('../models/StudentProfile');
const Skill = require('../models/Skill');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const calculateMatchScore = require('../utils/matchScore');
const { notify } = require('../services/notification.service');

// @route POST /api/jobs/:id/apply
const applyToJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) throw new ApiError(404, 'Job not found.');
  if (job.status !== 'PUBLISHED') throw new ApiError(400, 'This job is no longer accepting applications.');
  if (new Date(job.applicationDeadline) < new Date()) throw new ApiError(400, 'Application deadline has passed.');

  const profile = await StudentProfile.findOne({ user: req.user._id });
  if (!profile) throw new ApiError(404, 'Student profile not found.');
  if (!profile.resume?.resumeUrl) throw new ApiError(400, 'Please upload your resume before applying.');

  const alreadyApplied = await Application.findOne({ job: job._id, student: profile._id });
  if (alreadyApplied) throw new ApiError(409, 'You have already applied to this job.');

  const studentSkills = (await Skill.find({ student: profile._id })).map((s) => s.name);
  const { score, matchedSkills, missingSkills } = calculateMatchScore(studentSkills, job.skills, {
    studentExperienceCount: profile.experience?.length || 0,
  });

  const application = await Application.create({
    job: job._id,
    student: profile._id,
    recruiter: job.postedBy,
    matchScore: score,
    matchedSkills,
    missingSkills,
    resumeUrl: profile.resume.resumeUrl,
    coverNote: req.body.coverNote || '',
  });

  job.applicantsCount += 1;
  await job.save();

  await notify({
    recipient: job.postedBy,
    title: 'New Job Application',
    message: `${profile.fullName} applied for ${job.title}.`,
    type: 'APPLICATION',
    link: `/recruiter/applicants?job=${job._id}`,
  });

  res.status(201).json(new ApiResponse(201, application, 'Application submitted successfully.'));
});

const populateApplication = (query) =>
  query
    .populate({ path: 'job', populate: { path: 'company', select: 'name logo location' } })
    .populate({ path: 'student', select: 'fullName course department semester profilePhoto' });

// @route GET /api/applications
const getApplications = asyncHandler(async (req, res) => {
  const { status, jobId, page = 1, limit = 10 } = req.query;
  const filter = {};

  if (req.user.role === 'STUDENT') {
    const profile = await StudentProfile.findOne({ user: req.user._id });
    if (!profile) throw new ApiError(404, 'Student profile not found.');
    filter.student = profile._id;
  } else if (req.user.role === 'RECRUITER') {
    filter.recruiter = req.user._id;
  }
  // ADMIN sees all

  if (status) filter.status = status;
  if (jobId) filter.job = jobId;

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.max(1, parseInt(limit, 10));

  const [applications, total] = await Promise.all([
    populateApplication(Application.find(filter))
      .sort('-createdAt')
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Application.countDocuments(filter),
  ]);

  res.status(200).json(
    new ApiResponse(200, {
      applications,
      pagination: { total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) },
    })
  );
});

// @route GET /api/applications/:id
const getApplicationById = asyncHandler(async (req, res) => {
  const application = await populateApplication(Application.findById(req.params.id));
  if (!application) throw new ApiError(404, 'Application not found.');

  if (req.user.role === 'STUDENT') {
    const profile = await StudentProfile.findOne({ user: req.user._id });
    if (!application.student._id.equals(profile._id)) throw new ApiError(403, 'Access denied.');
  } else if (req.user.role === 'RECRUITER' && !application.recruiter.equals(req.user._id)) {
    throw new ApiError(403, 'Access denied.');
  }

  res.status(200).json(new ApiResponse(200, application));
});

// @route PUT /api/applications/:id/status
const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body;
  const validStatuses = ['APPLIED', 'UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEW', 'SELECTED', 'REJECTED'];
  if (!validStatuses.includes(status)) throw new ApiError(400, 'Invalid status.');

  const application = await Application.findById(req.params.id).populate('job');
  if (!application) throw new ApiError(404, 'Application not found.');
  if (!application.recruiter.equals(req.user._id) && req.user.role !== 'ADMIN') {
    throw new ApiError(403, 'Access denied.');
  }

  application.status = status;
  if (note) application.statusHistory.push({ status, changedAt: new Date(), note });
  await application.save();

  const profile = await StudentProfile.findById(application.student);
  const statusMessages = {
    UNDER_REVIEW: 'Your application is now under review.',
    SHORTLISTED: 'Congratulations! Your application has been shortlisted.',
    INTERVIEW: 'You have been moved to the interview stage.',
    SELECTED: "Congratulations! You've been selected for the position.",
    REJECTED: 'Your application was not selected this time.',
  };
  if (statusMessages[status] && profile) {
    await notify({
      recipient: profile.user,
      title: `Application ${status.replace('_', ' ')}`,
      message: `${statusMessages[status]} (${application.job.title})`,
      type: 'APPLICATION',
      link: `/student/applications/${application._id}`,
    });
  }

  if (status === 'SELECTED' && profile) {
    profile.isPlaced = true;
    await profile.save();
  }

  res.status(200).json(new ApiResponse(200, application, 'Application status updated.'));
});

module.exports = {
  applyToJob,
  getApplications,
  getApplicationById,
  updateApplicationStatus,
};
