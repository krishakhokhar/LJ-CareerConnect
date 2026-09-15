const asyncHandler = require('express-async-handler');
const StudentProfile = require('../models/StudentProfile');
const Skill = require('../models/Skill');
const Certification = require('../models/Certification');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const { uploadBuffer, deleteFile } = require('../services/storage.service');
const calculateProfileCompletion = require('../utils/profileCompletion');

// @route POST /api/resume/upload
const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'Please attach a PDF resume file.');

  const profile = await StudentProfile.findOne({ user: req.user._id });
  if (!profile) throw new ApiError(404, 'Student profile not found.');

  if (profile.resume?.publicId) {
    await deleteFile(profile.resume.publicId);
  }

  const result = await uploadBuffer(req.file.buffer, {
    folder: 'resumes',
    filename: req.file.originalname,
  });

  profile.resume = {
    resumeUrl: result.url,
    publicId: result.publicId,
    fileName: req.file.originalname,
    uploadedAt: new Date(),
  };

  const [skills, certifications] = await Promise.all([
    Skill.find({ student: profile._id }),
    Certification.find({ student: profile._id }),
  ]);
  profile.profileCompletion = calculateProfileCompletion({ ...profile.toObject(), skills, certifications });

  await profile.save();

  res.status(200).json(new ApiResponse(200, profile.resume, 'Resume uploaded successfully.'));
});

// @route DELETE /api/resume
const deleteResume = asyncHandler(async (req, res) => {
  const profile = await StudentProfile.findOne({ user: req.user._id });
  if (!profile) throw new ApiError(404, 'Student profile not found.');
  if (!profile.resume?.resumeUrl) throw new ApiError(404, 'No resume on file.');

  await deleteFile(profile.resume.publicId);
  profile.resume = { resumeUrl: '', publicId: '', fileName: '', uploadedAt: undefined };

  const [skills, certifications] = await Promise.all([
    Skill.find({ student: profile._id }),
    Certification.find({ student: profile._id }),
  ]);
  profile.profileCompletion = calculateProfileCompletion({ ...profile.toObject(), skills, certifications });

  await profile.save();
  res.status(200).json(new ApiResponse(200, {}, 'Resume deleted.'));
});

module.exports = { uploadResume, deleteResume };
