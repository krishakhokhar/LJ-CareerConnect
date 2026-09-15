const asyncHandler = require('express-async-handler');
const Job = require('../models/Job');
const Application = require('../models/Application');
const StudentProfile = require('../models/StudentProfile');
const Skill = require('../models/Skill');
const Company = require('../models/Company');
const RecruiterProfile = require('../models/RecruiterProfile');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const calculateMatchScore = require('../utils/matchScore');

// @route GET /api/jobs
const getJobs = asyncHandler(async (req, res) => {
  const {
    search,
    jobType,
    location,
    minSalary,
    skills,
    company,
    sort = '-createdAt',
    page = 1,
    limit = 10,
    status,
  } = req.query;

  const filter = {};

  if (req.user?.role === 'RECRUITER') {
    filter.postedBy = req.user._id;
    if (status) filter.status = status;
  } else if (req.user?.role === 'ADMIN') {
    if (status) filter.status = status;
  } else {
    filter.status = 'PUBLISHED';
  }

  if (search) {
    filter.$or = [
      { title: new RegExp(search, 'i') },
      { skills: new RegExp(search, 'i') },
      { location: new RegExp(search, 'i') },
    ];
  }
  if (jobType) filter.jobType = jobType;
  if (location) filter.location = new RegExp(location, 'i');
  if (minSalary) filter.salaryMax = { $gte: Number(minSalary) };
  if (skills) {
    const skillList = skills.split(',').map((s) => new RegExp(`^${s.trim()}$`, 'i'));
    filter.skills = { $in: skillList };
  }
  if (company) filter.company = company;

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.max(1, parseInt(limit, 10));

  const [jobs, total] = await Promise.all([
    Job.find(filter)
      .populate('company', 'name logo location industry')
      .sort(sort)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Job.countDocuments(filter),
  ]);

  let matchScores = {};
  if (req.user?.role === 'STUDENT') {
    const profile = await StudentProfile.findOne({ user: req.user._id });
    if (profile) {
      const studentSkills = (await Skill.find({ student: profile._id })).map((s) => s.name);
      jobs.forEach((job) => {
        const { score } = calculateMatchScore(studentSkills, job.skills);
        matchScores[job._id] = score;
      });
    }
  }

  const jobsWithScore = jobs.map((job) => ({
    ...job.toObject(),
    aiMatchScore: matchScores[job._id] ?? null,
  }));

  res.status(200).json(
    new ApiResponse(200, {
      jobs: jobsWithScore,
      pagination: { total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) },
    })
  );
});

// @route GET /api/jobs/:id
const getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id).populate('company').populate('postedBy', 'email');
  if (!job) throw new ApiError(404, 'Job not found.');

  let aiMatchScore = null;
  let hasApplied = false;
  let isSaved = false;

  if (req.user?.role === 'STUDENT') {
    const profile = await StudentProfile.findOne({ user: req.user._id });
    if (profile) {
      const studentSkills = (await Skill.find({ student: profile._id })).map((s) => s.name);
      const { score } = calculateMatchScore(studentSkills, job.skills);
      aiMatchScore = score;
      hasApplied = Boolean(await Application.exists({ job: job._id, student: profile._id }));
      isSaved = profile.savedJobs.some((id) => id.equals(job._id));
    }
  }

  res.status(200).json(new ApiResponse(200, { job, aiMatchScore, hasApplied, isSaved }));
});

// @route POST /api/jobs
const createJob = asyncHandler(async (req, res) => {
  const recruiterProfile = await RecruiterProfile.findOne({ user: req.user._id });
  if (!recruiterProfile) throw new ApiError(400, 'Complete your recruiter profile before posting jobs.');

  const job = await Job.create({
    ...req.body,
    company: recruiterProfile.company,
    postedBy: req.user._id,
  });

  res.status(201).json(new ApiResponse(201, job, 'Job posted successfully.'));
});

// @route PUT /api/jobs/:id
const updateJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) throw new ApiError(404, 'Job not found.');
  if (!job.postedBy.equals(req.user._id) && req.user.role !== 'ADMIN') {
    throw new ApiError(403, 'You can only edit jobs you posted.');
  }

  const allowedFields = [
    'title', 'description', 'responsibilities', 'requirements', 'skills', 'qualification',
    'experienceRequired', 'location', 'jobType', 'workMode', 'salaryMin', 'salaryMax',
    'openings', 'applicationDeadline', 'status',
  ];
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) job[field] = req.body[field];
  });

  await job.save();
  res.status(200).json(new ApiResponse(200, job, 'Job updated successfully.'));
});

// @route DELETE /api/jobs/:id
const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) throw new ApiError(404, 'Job not found.');
  if (!job.postedBy.equals(req.user._id) && req.user.role !== 'ADMIN') {
    throw new ApiError(403, 'You can only delete jobs you posted.');
  }
  await Application.deleteMany({ job: job._id });
  await job.deleteOne();
  res.status(200).json(new ApiResponse(200, {}, 'Job deleted successfully.'));
});

// @route PATCH /api/jobs/:id/status
const updateJobStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!['DRAFT', 'PUBLISHED', 'CLOSED'].includes(status)) throw new ApiError(400, 'Invalid status.');

  const job = await Job.findById(req.params.id);
  if (!job) throw new ApiError(404, 'Job not found.');
  if (!job.postedBy.equals(req.user._id) && req.user.role !== 'ADMIN') {
    throw new ApiError(403, 'You can only update jobs you posted.');
  }

  job.status = status;
  await job.save();
  res.status(200).json(new ApiResponse(200, job, `Job marked as ${status.toLowerCase()}.`));
});

// @route POST /api/jobs/:id/save
const toggleSaveJob = asyncHandler(async (req, res) => {
  const profile = await StudentProfile.findOne({ user: req.user._id });
  if (!profile) throw new ApiError(404, 'Student profile not found.');

  const job = await Job.findById(req.params.id);
  if (!job) throw new ApiError(404, 'Job not found.');

  const index = profile.savedJobs.findIndex((id) => id.equals(job._id));
  let saved;
  if (index > -1) {
    profile.savedJobs.splice(index, 1);
    saved = false;
  } else {
    profile.savedJobs.push(job._id);
    saved = true;
  }
  await profile.save();

  res.status(200).json(new ApiResponse(200, { saved }, saved ? 'Job saved.' : 'Job removed from saved list.'));
});

// @route GET /api/jobs/saved/list
const getSavedJobs = asyncHandler(async (req, res) => {
  const profile = await StudentProfile.findOne({ user: req.user._id }).populate({
    path: 'savedJobs',
    populate: { path: 'company', select: 'name logo location' },
  });
  if (!profile) throw new ApiError(404, 'Student profile not found.');
  res.status(200).json(new ApiResponse(200, profile.savedJobs));
});

module.exports = {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  updateJobStatus,
  toggleSaveJob,
  getSavedJobs,
};
