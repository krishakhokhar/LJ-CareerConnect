const asyncHandler = require('express-async-handler');
const RecruiterProfile = require('../models/RecruiterProfile');
const Company = require('../models/Company');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Interview = require('../models/Interview');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

// @route GET /api/recruiters/profile
const getMyProfile = asyncHandler(async (req, res) => {
  const profile = await RecruiterProfile.findOne({ user: req.user._id }).populate('company');
  if (!profile) throw new ApiError(404, 'Recruiter profile not found.');
  res.status(200).json(new ApiResponse(200, profile));
});

// @route PUT /api/recruiters/profile
const updateMyProfile = asyncHandler(async (req, res) => {
  const profile = await RecruiterProfile.findOne({ user: req.user._id });
  if (!profile) throw new ApiError(404, 'Recruiter profile not found.');

  ['recruiterName', 'designation', 'phone'].forEach((field) => {
    if (req.body[field] !== undefined) profile[field] = req.body[field];
  });
  await profile.save();

  if (req.body.company) {
    const company = await Company.findById(profile.company);
    if (company) {
      ['name', 'website', 'description', 'location', 'industry', 'size', 'logo'].forEach((field) => {
        if (req.body.company[field] !== undefined) company[field] = req.body.company[field];
      });
      await company.save();
    }
  }

  const updated = await RecruiterProfile.findById(profile._id).populate('company');
  res.status(200).json(new ApiResponse(200, updated, 'Company profile updated successfully.'));
});

// @route GET /api/recruiters/dashboard
const getDashboardStats = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ postedBy: req.user._id });
  const jobIds = jobs.map((j) => j._id);

  const applications = await Application.find({ job: { $in: jobIds } });
  const interviews = await Interview.find({ recruiter: req.user._id });

  const statusCounts = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {});

  const applicationsPerJob = jobs.map((job) => ({
    job: job.title,
    applicants: applications.filter((a) => a.job.equals(job._id)).length,
  }));

  const hiringFunnel = [
    { stage: 'Applied', count: applications.length },
    { stage: 'Shortlisted', count: (statusCounts.SHORTLISTED || 0) + (statusCounts.INTERVIEW || 0) + (statusCounts.SELECTED || 0) },
    { stage: 'Interview', count: (statusCounts.INTERVIEW || 0) + (statusCounts.SELECTED || 0) },
    { stage: 'Selected', count: statusCounts.SELECTED || 0 },
  ];

  res.status(200).json(
    new ApiResponse(200, {
      stats: {
        activeJobs: jobs.filter((j) => j.status === 'PUBLISHED').length,
        totalApplicants: applications.length,
        shortlisted: statusCounts.SHORTLISTED || 0,
        interviews: interviews.length,
        selected: statusCounts.SELECTED || 0,
      },
      charts: {
        applicationsPerJob,
        hiringFunnel,
        applicationStatus: Object.entries(statusCounts).map(([status, count]) => ({ status, count })),
      },
    })
  );
});

// @route GET /api/recruiters/applicants
const getApplicants = asyncHandler(async (req, res) => {
  const { jobId, status, page = 1, limit = 10 } = req.query;
  const filter = { recruiter: req.user._id };
  if (jobId) filter.job = jobId;
  if (status) filter.status = status;

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.max(1, parseInt(limit, 10));

  const [applicants, total] = await Promise.all([
    Application.find(filter)
      .populate({ path: 'job', select: 'title' })
      .populate({ path: 'student', select: 'fullName course department semester profilePhoto' })
      .sort('-matchScore')
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Application.countDocuments(filter),
  ]);

  res.status(200).json(
    new ApiResponse(200, {
      applicants,
      pagination: { total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) },
    })
  );
});

module.exports = { getMyProfile, updateMyProfile, getDashboardStats, getApplicants };
