const asyncHandler = require('express-async-handler');
const PlacementDrive = require('../models/PlacementDrive');
const StudentProfile = require('../models/StudentProfile');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const { notifyMany } = require('../services/notification.service');

// @route GET /api/placement-drives
const getDrives = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = {};
  if (status) filter.status = status;

  let drives = await PlacementDrive.find(filter).populate('company', 'name logo location').sort('driveDate');

  if (req.user.role === 'STUDENT') {
    const profile = await StudentProfile.findOne({ user: req.user._id });
    drives = drives.map((drive) => {
      const d = drive.toObject();
      d.isEligible =
        (!drive.eligibility.minCgpa || (profile?.cgpa || 0) >= drive.eligibility.minCgpa) &&
        (!drive.eligibility.courses?.length || drive.eligibility.courses.includes(profile?.course)) &&
        (!drive.eligibility.graduationYear?.length || drive.eligibility.graduationYear.includes(profile?.graduationYear));
      d.isRegistered = profile ? drive.registeredStudents.some((id) => id.equals(profile._id)) : false;
      return d;
    });
  }

  res.status(200).json(new ApiResponse(200, drives));
});

// @route GET /api/placement-drives/:id
const getDriveById = asyncHandler(async (req, res) => {
  const drive = await PlacementDrive.findById(req.params.id).populate('company').populate('job');
  if (!drive) throw new ApiError(404, 'Placement drive not found.');
  res.status(200).json(new ApiResponse(200, drive));
});

// @route POST /api/placement-drives
const createDrive = asyncHandler(async (req, res) => {
  const drive = await PlacementDrive.create({ ...req.body, createdBy: req.user._id });

  const students = await StudentProfile.find({}).select('user');
  const userIds = students.map((s) => s.user);
  await notifyMany(userIds, {
    title: 'New Placement Drive',
    message: `${drive.driveName} (${drive.jobRole}) has been announced. Check eligibility and apply before the deadline.`,
    type: 'DRIVE',
    link: '/student/placement-drives',
  });

  res.status(201).json(new ApiResponse(201, drive, 'Placement drive created successfully.'));
});

// @route PUT /api/placement-drives/:id
const updateDrive = asyncHandler(async (req, res) => {
  const drive = await PlacementDrive.findById(req.params.id);
  if (!drive) throw new ApiError(404, 'Placement drive not found.');

  const fields = [
    'driveName', 'jobRole', 'driveDate', 'driveTime', 'mode', 'venue', 'eligibility',
    'requiredSkills', 'salaryPackage', 'openings', 'applicationDeadline', 'description', 'status',
  ];
  fields.forEach((field) => {
    if (req.body[field] !== undefined) drive[field] = req.body[field];
  });
  await drive.save();
  res.status(200).json(new ApiResponse(200, drive, 'Placement drive updated successfully.'));
});

// @route DELETE /api/placement-drives/:id
const deleteDrive = asyncHandler(async (req, res) => {
  const drive = await PlacementDrive.findByIdAndDelete(req.params.id);
  if (!drive) throw new ApiError(404, 'Placement drive not found.');
  res.status(200).json(new ApiResponse(200, {}, 'Placement drive deleted.'));
});

// @route POST /api/placement-drives/:id/register
const registerForDrive = asyncHandler(async (req, res) => {
  const drive = await PlacementDrive.findById(req.params.id);
  if (!drive) throw new ApiError(404, 'Placement drive not found.');
  if (new Date(drive.applicationDeadline) < new Date()) throw new ApiError(400, 'Registration deadline has passed.');

  const profile = await StudentProfile.findOne({ user: req.user._id });
  if (!profile) throw new ApiError(404, 'Student profile not found.');

  if (drive.registeredStudents.some((id) => id.equals(profile._id))) {
    throw new ApiError(409, 'You are already registered for this drive.');
  }

  drive.registeredStudents.push(profile._id);
  await drive.save();

  res.status(200).json(new ApiResponse(200, {}, 'Successfully registered for the placement drive.'));
});

module.exports = { getDrives, getDriveById, createDrive, updateDrive, deleteDrive, registerForDrive };
