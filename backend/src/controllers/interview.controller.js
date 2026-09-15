const asyncHandler = require('express-async-handler');
const Interview = require('../models/Interview');
const Application = require('../models/Application');
const StudentProfile = require('../models/StudentProfile');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const { notify } = require('../services/notification.service');

// @route POST /api/interviews
const scheduleInterview = asyncHandler(async (req, res) => {
  const { applicationId, scheduledDate, scheduledTime, interviewType, meetingLink, location, notes, round } = req.body;

  const application = await Application.findById(applicationId).populate('job');
  if (!application) throw new ApiError(404, 'Application not found.');
  if (!application.recruiter.equals(req.user._id)) throw new ApiError(403, 'Access denied.');

  const interview = await Interview.create({
    application: application._id,
    job: application.job._id,
    student: application.student,
    recruiter: req.user._id,
    scheduledDate,
    scheduledTime,
    interviewType,
    meetingLink,
    location,
    notes,
    round,
  });

  if (application.status === 'SHORTLISTED' || application.status === 'UNDER_REVIEW' || application.status === 'APPLIED') {
    application.status = 'INTERVIEW';
    await application.save();
  }

  const studentProfile = await StudentProfile.findById(application.student);
  if (studentProfile) {
    await notify({
      recipient: studentProfile.user,
      title: 'Interview Scheduled',
      message: `Interview scheduled for ${application.job.title} on ${new Date(scheduledDate).toLocaleDateString()} at ${scheduledTime}.`,
      type: 'INTERVIEW',
      link: `/student/interviews`,
    });
  }

  res.status(201).json(new ApiResponse(201, interview, 'Interview scheduled successfully.'));
});

const populateInterview = (query) =>
  query
    .populate({ path: 'job', select: 'title', populate: { path: 'company', select: 'name logo' } })
    .populate({ path: 'student', select: 'fullName course department profilePhoto' });

// @route GET /api/interviews
const getInterviews = asyncHandler(async (req, res) => {
  const { status, upcoming } = req.query;
  const filter = {};

  if (req.user.role === 'STUDENT') {
    const profile = await StudentProfile.findOne({ user: req.user._id });
    if (!profile) throw new ApiError(404, 'Student profile not found.');
    filter.student = profile._id;
  } else if (req.user.role === 'RECRUITER') {
    filter.recruiter = req.user._id;
  }

  if (status) filter.status = status;
  if (upcoming === 'true') {
    filter.scheduledDate = { $gte: new Date() };
    filter.status = 'SCHEDULED';
  }

  const interviews = await populateInterview(Interview.find(filter)).sort('scheduledDate');
  res.status(200).json(new ApiResponse(200, interviews));
});

// @route PUT /api/interviews/:id
const updateInterview = asyncHandler(async (req, res) => {
  const interview = await Interview.findById(req.params.id);
  if (!interview) throw new ApiError(404, 'Interview not found.');
  if (!interview.recruiter.equals(req.user._id)) throw new ApiError(403, 'Access denied.');

  const fields = ['scheduledDate', 'scheduledTime', 'interviewType', 'meetingLink', 'location', 'notes', 'round', 'status', 'feedback'];
  fields.forEach((field) => {
    if (req.body[field] !== undefined) interview[field] = req.body[field];
  });
  await interview.save();

  res.status(200).json(new ApiResponse(200, interview, 'Interview updated successfully.'));
});

module.exports = { scheduleInterview, getInterviews, updateInterview };
