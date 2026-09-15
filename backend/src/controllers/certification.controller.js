const asyncHandler = require('express-async-handler');
const Certification = require('../models/Certification');
const StudentProfile = require('../models/StudentProfile');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const { uploadBuffer, deleteFile } = require('../services/storage.service');

const getMyProfileId = async (userId) => {
  const profile = await StudentProfile.findOne({ user: userId });
  if (!profile) throw new ApiError(404, 'Student profile not found.');
  return profile._id;
};

// @route GET /api/certifications
const getMyCertifications = asyncHandler(async (req, res) => {
  const studentId = await getMyProfileId(req.user._id);
  const certifications = await Certification.find({ student: studentId }).sort('-issueDate');
  res.status(200).json(new ApiResponse(200, certifications));
});

// @route POST /api/certifications
const addCertification = asyncHandler(async (req, res) => {
  const studentId = await getMyProfileId(req.user._id);
  const { name, organization, issueDate, credentialId, credentialUrl } = req.body;
  if (!name || !organization) throw new ApiError(400, 'Certificate name and organization are required.');

  let fileUrl = '';
  let filePublicId = '';
  if (req.file) {
    const result = await uploadBuffer(req.file.buffer, {
      folder: 'certificates',
      filename: req.file.originalname,
    });
    fileUrl = result.url;
    filePublicId = result.publicId;
  }

  const certification = await Certification.create({
    student: studentId,
    name,
    organization,
    issueDate,
    credentialId,
    credentialUrl,
    fileUrl,
    filePublicId,
  });

  res.status(201).json(new ApiResponse(201, certification, 'Certification added successfully.'));
});

// @route DELETE /api/certifications/:id
const deleteCertification = asyncHandler(async (req, res) => {
  const studentId = await getMyProfileId(req.user._id);
  const certification = await Certification.findOne({ _id: req.params.id, student: studentId });
  if (!certification) throw new ApiError(404, 'Certification not found.');

  if (certification.filePublicId) await deleteFile(certification.filePublicId);
  await certification.deleteOne();

  res.status(200).json(new ApiResponse(200, {}, 'Certification removed.'));
});

module.exports = { getMyCertifications, addCertification, deleteCertification };
