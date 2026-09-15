const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const RecruiterProfile = require('../models/RecruiterProfile');
const Company = require('../models/Company');
const generateToken = require('../utils/generateToken');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const calculateProfileCompletion = require('../utils/profileCompletion');
const env = require('../config/env');

const sanitizeUser = (user) => ({
  id: user._id,
  email: user.email,
  role: user.role,
});

// @route POST /api/auth/register/student
const registerStudent = asyncHandler(async (req, res) => {
  const { fullName, email, password, studentId, course, department, semester, graduationYear, phone } = req.body;

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) throw new ApiError(409, 'An account with this email already exists.');

  const existingStudentId = await StudentProfile.findOne({ studentId });
  if (existingStudentId) throw new ApiError(409, 'This Student ID is already registered.');

  const user = await User.create({ email, password, role: 'STUDENT' });

  const profile = await StudentProfile.create({
    user: user._id,
    fullName,
    studentId,
    course,
    department,
    semester,
    graduationYear,
    phone,
  });

  profile.profileCompletion = calculateProfileCompletion(profile);
  await profile.save();

  const token = generateToken(user._id, user.role);
  res
    .status(201)
    .json(new ApiResponse(201, { token, user: sanitizeUser(user), profile }, 'Student account created successfully.'));
});

// @route POST /api/auth/register/recruiter
const registerRecruiter = asyncHandler(async (req, res) => {
  const { recruiterName, companyName, officialEmail, password, companyWebsite, companyDescription, companyLocation } = req.body;

  const existingUser = await User.findOne({ email: officialEmail.toLowerCase() });
  if (existingUser) throw new ApiError(409, 'An account with this email already exists.');

  let company = await Company.findOne({ name: new RegExp(`^${companyName.trim()}$`, 'i') });
  if (!company) {
    company = await Company.create({
      name: companyName,
      website: companyWebsite,
      description: companyDescription,
      location: companyLocation,
    });
  }

  const user = await User.create({ email: officialEmail, password, role: 'RECRUITER' });

  const profile = await RecruiterProfile.create({
    user: user._id,
    recruiterName,
    officialEmail,
    company: company._id,
  });

  const token = generateToken(user._id, user.role);
  res.status(201).json(
    new ApiResponse(
      201,
      { token, user: sanitizeUser(user), profile: await profile.populate('company') },
      'Recruiter account created successfully.'
    )
  );
});

// @route POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password.');
  }
  if (!user.isActive) {
    throw new ApiError(403, 'Your account has been deactivated. Contact the placement office.');
  }

  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });

  let profile = null;
  if (user.role === 'STUDENT') {
    profile = await StudentProfile.findOne({ user: user._id });
  } else if (user.role === 'RECRUITER') {
    profile = await RecruiterProfile.findOne({ user: user._id }).populate('company');
  }

  const token = generateToken(user._id, user.role);
  res.status(200).json(new ApiResponse(200, { token, user: sanitizeUser(user), profile }, 'Login successful.'));
});

// @route GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  const user = req.user;
  let profile = null;
  if (user.role === 'STUDENT') {
    profile = await StudentProfile.findOne({ user: user._id });
  } else if (user.role === 'RECRUITER') {
    profile = await RecruiterProfile.findOne({ user: user._id }).populate('company');
  }
  res.status(200).json(new ApiResponse(200, { user: sanitizeUser(user), profile }));
});

// @route POST /api/auth/forgot-password
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() });

  // Always respond the same way to avoid leaking which emails are registered
  const genericMessage = 'If an account exists for this email, a password reset link has been generated.';

  if (!user) {
    return res.status(200).json(new ApiResponse(200, {}, genericMessage));
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${env.CLIENT_URL}/reset-password/${resetToken}`;

  // No email service is configured in this project. In development, the
  // reset link is logged to the server console and returned in the response
  // so the flow remains fully testable without external credentials.
  console.log(`[Password Reset] ${email} -> ${resetUrl}`);

  const payload = env.NODE_ENV === 'production' ? {} : { resetUrl, resetToken };
  res.status(200).json(new ApiResponse(200, payload, genericMessage));
});

// @route POST /api/auth/reset-password
const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  }).select('+resetPasswordToken +resetPasswordExpire');

  if (!user) throw new ApiError(400, 'Reset link is invalid or has expired.');

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.status(200).json(new ApiResponse(200, {}, 'Password reset successful. You can now log in.'));
});

// @route POST /api/auth/logout
const logout = asyncHandler(async (req, res) => {
  // Stateless JWT: client discards the token. Endpoint kept for a consistent API surface.
  res.status(200).json(new ApiResponse(200, {}, 'Logged out successfully.'));
});

module.exports = {
  registerStudent,
  registerRecruiter,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  logout,
};
