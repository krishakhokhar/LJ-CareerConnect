const asyncHandler = require('express-async-handler');
const Internship = require('../models/Internship');
const InternshipApplication = require('../models/InternshipApplication');
const StudentProfile = require('../models/StudentProfile');
const RecruiterProfile = require('../models/RecruiterProfile');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const { notify } = require('../services/notification.service');
const { uploadBuffer } = require('../services/storage.service');

// @route GET /api/internships
const getInternships = asyncHandler(async (req, res) => {
  const { search, location, workMode, page = 1, limit = 10, status } = req.query;
  const filter = {};

  if (req.user?.role === 'RECRUITER') {
    filter.postedBy = req.user._id;
    if (status) filter.status = status;
  } else if (req.user?.role === 'ADMIN') {
    if (status) filter.status = status;
  } else {
    filter.status = 'PUBLISHED';
  }

  if (search) filter.$or = [{ title: new RegExp(search, 'i') }, { skills: new RegExp(search, 'i') }];
  if (location) filter.location = new RegExp(location, 'i');
  if (workMode) filter.workMode = workMode;

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.max(1, parseInt(limit, 10));

  const [internships, total] = await Promise.all([
    Internship.find(filter)
      .populate('company', 'name logo location')
      .sort('-createdAt')
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Internship.countDocuments(filter),
  ]);

  res.status(200).json(
    new ApiResponse(200, {
      internships,
      pagination: { total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) },
    })
  );
});

// @route GET /api/internships/:id
const getInternshipById = asyncHandler(async (req, res) => {
  const internship = await Internship.findById(req.params.id).populate('company');
  if (!internship) throw new ApiError(404, 'Internship not found.');

  let hasApplied = false;
  if (req.user?.role === 'STUDENT') {
    const profile = await StudentProfile.findOne({ user: req.user._id });
    if (profile) {
      hasApplied = Boolean(await InternshipApplication.exists({ internship: internship._id, student: profile._id }));
    }
  }

  res.status(200).json(new ApiResponse(200, { internship, hasApplied }));
});

// @route POST /api/internships
const createInternship = asyncHandler(async (req, res) => {
  const recruiterProfile = await RecruiterProfile.findOne({ user: req.user._id });
  if (!recruiterProfile) throw new ApiError(400, 'Complete your recruiter profile before posting internships.');

  const internship = await Internship.create({
    ...req.body,
    company: recruiterProfile.company,
    postedBy: req.user._id,
  });

  res.status(201).json(new ApiResponse(201, internship, 'Internship posted successfully.'));
});

// @route PUT /api/internships/:id
const updateInternship = asyncHandler(async (req, res) => {
  const internship = await Internship.findById(req.params.id);
  if (!internship) throw new ApiError(404, 'Internship not found.');
  if (!internship.postedBy.equals(req.user._id) && req.user.role !== 'ADMIN') {
    throw new ApiError(403, 'You can only edit internships you posted.');
  }

  const fields = ['title', 'description', 'skills', 'duration', 'location', 'workMode', 'stipend', 'isPaid', 'openings', 'applicationDeadline', 'startDate', 'ppoOpportunity', 'status'];
  fields.forEach((field) => {
    if (req.body[field] !== undefined) internship[field] = req.body[field];
  });
  await internship.save();

  res.status(200).json(new ApiResponse(200, internship, 'Internship updated successfully.'));
});

// @route DELETE /api/internships/:id
const deleteInternship = asyncHandler(async (req, res) => {
  const internship = await Internship.findById(req.params.id);
  if (!internship) throw new ApiError(404, 'Internship not found.');
  if (!internship.postedBy.equals(req.user._id) && req.user.role !== 'ADMIN') {
    throw new ApiError(403, 'You can only delete internships you posted.');
  }
  await InternshipApplication.deleteMany({ internship: internship._id });
  await internship.deleteOne();
  res.status(200).json(new ApiResponse(200, {}, 'Internship deleted successfully.'));
});

// @route POST /api/internships/:id/apply
const applyToInternship = asyncHandler(async (req, res) => {
  const internship = await Internship.findById(req.params.id);
  if (!internship) throw new ApiError(404, 'Internship not found.');
  if (internship.status !== 'PUBLISHED') throw new ApiError(400, 'This internship is no longer accepting applications.');

  const profile = await StudentProfile.findOne({ user: req.user._id });
  if (!profile) throw new ApiError(404, 'Student profile not found.');
  if (!profile.resume?.resumeUrl) throw new ApiError(400, 'Please upload your resume before applying.');

  const existing = await InternshipApplication.findOne({ internship: internship._id, student: profile._id });
  if (existing) throw new ApiError(409, 'You have already applied to this internship.');

  const application = await InternshipApplication.create({
    internship: internship._id,
    student: profile._id,
    recruiter: internship.postedBy,
    resumeUrl: profile.resume.resumeUrl,
    coverNote: req.body.coverNote || '',
  });

  await notify({
    recipient: internship.postedBy,
    title: 'New Internship Application',
    message: `${profile.fullName} applied for ${internship.title}.`,
    type: 'INTERNSHIP',
    link: `/recruiter/internships`,
  });

  res.status(201).json(new ApiResponse(201, application, 'Application submitted successfully.'));
});

// @route GET /api/internships/:id/applicants
const getInternshipApplicants = asyncHandler(async (req, res) => {
  const internship = await Internship.findById(req.params.id);
  if (!internship) throw new ApiError(404, 'Internship not found.');
  if (!internship.postedBy.equals(req.user._id) && req.user.role !== 'ADMIN') {
    throw new ApiError(403, 'Access denied.');
  }

  const applicants = await InternshipApplication.find({ internship: internship._id })
    .populate({ path: 'student', select: 'fullName course department semester profilePhoto' })
    .sort('-createdAt');

  res.status(200).json(new ApiResponse(200, applicants));
});

// @route PUT /api/internships/applications/:id/status
const updateInternshipApplicationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['APPLIED', 'UNDER_REVIEW', 'SHORTLISTED', 'SELECTED', 'REJECTED', 'COMPLETED'];
  if (!validStatuses.includes(status)) throw new ApiError(400, 'Invalid status.');

  const application = await InternshipApplication.findById(req.params.id).populate('internship');
  if (!application) throw new ApiError(404, 'Application not found.');
  if (!application.recruiter.equals(req.user._id) && req.user.role !== 'ADMIN') {
    throw new ApiError(403, 'Access denied.');
  }

  application.status = status;
  await application.save();

  const profile = await StudentProfile.findById(application.student);
  if (profile) {
    await notify({
      recipient: profile.user,
      title: `Internship Application ${status.replace('_', ' ')}`,
      message: `Your application for ${application.internship.title} is now: ${status.replace('_', ' ')}.`,
      type: 'INTERNSHIP',
      link: '/student/internships',
    });
  }

  res.status(200).json(new ApiResponse(200, application, 'Application status updated.'));
});

// @route GET /api/internships/my/applications
const getMyInternshipApplications = asyncHandler(async (req, res) => {
  const profile = await StudentProfile.findOne({ user: req.user._id });
  if (!profile) throw new ApiError(404, 'Student profile not found.');

  const applications = await InternshipApplication.find({ student: profile._id })
    .populate({ path: 'internship', populate: { path: 'company', select: 'name logo location' } })
    .sort('-createdAt');

  res.status(200).json(new ApiResponse(200, applications));
});

// @route POST /api/internships/applications/:id/documents
const uploadInternshipDocument = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'Please attach a document file.');

  const profile = await StudentProfile.findOne({ user: req.user._id });
  if (!profile) throw new ApiError(404, 'Student profile not found.');

  const application = await InternshipApplication.findOne({ _id: req.params.id, student: profile._id });
  if (!application) throw new ApiError(404, 'Internship application not found.');

  const result = await uploadBuffer(req.file.buffer, {
    folder: 'internship-documents',
    filename: req.file.originalname,
  });

  application.documents.push({ name: req.file.originalname, url: result.url });
  await application.save();

  res.status(200).json(new ApiResponse(200, application.documents, 'Document uploaded successfully.'));
});

module.exports = {
  getInternships,
  getInternshipById,
  createInternship,
  updateInternship,
  deleteInternship,
  applyToInternship,
  getInternshipApplicants,
  updateInternshipApplicationStatus,
  getMyInternshipApplications,
  uploadInternshipDocument,
};
