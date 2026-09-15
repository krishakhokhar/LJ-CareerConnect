const asyncHandler = require('express-async-handler');
const StudentProfile = require('../models/StudentProfile');
const Skill = require('../models/Skill');
const Certification = require('../models/Certification');
const Application = require('../models/Application');
const Interview = require('../models/Interview');
const Job = require('../models/Job');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const calculateProfileCompletion = require('../utils/profileCompletion');
const calculateMatchScore = require('../utils/matchScore');

const buildFullProfile = async (userId) => {
  const profile = await StudentProfile.findOne({ user: userId }).populate('user', 'email');
  if (!profile) return null;
  const [skills, certifications] = await Promise.all([
    Skill.find({ student: profile._id }).sort('category name'),
    Certification.find({ student: profile._id }).sort('-issueDate'),
  ]);
  const completion = calculateProfileCompletion({
    ...profile.toObject(),
    skills,
    certifications,
  });
  if (completion !== profile.profileCompletion) {
    profile.profileCompletion = completion;
    await profile.save();
  }
  return { ...profile.toObject(), skills, certifications };
};

// @route GET /api/students/profile
const getMyProfile = asyncHandler(async (req, res) => {
  const profile = await buildFullProfile(req.user._id);
  if (!profile) throw new ApiError(404, 'Student profile not found.');
  res.status(200).json(new ApiResponse(200, profile));
});

// @route PUT /api/students/profile
const updateMyProfile = asyncHandler(async (req, res) => {
  const profile = await StudentProfile.findOne({ user: req.user._id });
  if (!profile) throw new ApiError(404, 'Student profile not found.');

  const editableFields = [
    'fullName', 'dateOfBirth', 'gender', 'profilePhoto',
    'course', 'department', 'semester', 'graduationYear', 'cgpa',
    'phone', 'address', 'city', 'state',
    'experience', 'projects',
    'linkedinUrl', 'githubUrl', 'portfolioUrl',
  ];
  editableFields.forEach((field) => {
    if (req.body[field] !== undefined) profile[field] = req.body[field];
  });

  const [skills, certifications] = await Promise.all([
    Skill.find({ student: profile._id }),
    Certification.find({ student: profile._id }),
  ]);
  profile.profileCompletion = calculateProfileCompletion({ ...profile.toObject(), skills, certifications });

  await profile.save();
  res.status(200).json(new ApiResponse(200, profile, 'Profile updated successfully.'));
});

// @route GET /api/students/dashboard
const getDashboardStats = asyncHandler(async (req, res) => {
  const profile = await StudentProfile.findOne({ user: req.user._id });
  if (!profile) throw new ApiError(404, 'Student profile not found.');

  const [applications, interviews, recentApplications, upcomingInterviews] = await Promise.all([
    Application.find({ student: profile._id }),
    Interview.find({ student: profile._id }),
    Application.find({ student: profile._id })
      .populate({ path: 'job', populate: { path: 'company', select: 'name logo' } })
      .sort('-createdAt')
      .limit(5),
    Interview.find({ student: profile._id, status: 'SCHEDULED', scheduledDate: { $gte: new Date() } })
      .populate({ path: 'job', select: 'title' })
      .sort('scheduledDate')
      .limit(5),
  ]);

  const statusCounts = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {});

  const monthlyMap = {};
  applications.forEach((app) => {
    const key = new Date(app.createdAt).toLocaleString('default', { month: 'short', year: '2-digit' });
    monthlyMap[key] = (monthlyMap[key] || 0) + 1;
  });
  const monthlyApplications = Object.entries(monthlyMap).map(([month, count]) => ({ month, count }));

  const skills = await Skill.find({ student: profile._id });
  const skillCategoryMap = {};
  skills.forEach((s) => {
    skillCategoryMap[s.category] = (skillCategoryMap[s.category] || 0) + 1;
  });
  const skillsDistribution = Object.entries(skillCategoryMap).map(([category, count]) => ({ category, count }));

  const studentSkillNames = skills.map((s) => s.name);
  const recommendedJobsRaw = await Job.find({ status: 'PUBLISHED' }).sort('-createdAt').limit(20);
  const recommendedJobs = recommendedJobsRaw
    .map((job) => ({
      ...job.toObject(),
      aiMatchScore: calculateMatchScore(studentSkillNames, job.skills).score,
    }))
    .sort((a, b) => b.aiMatchScore - a.aiMatchScore)
    .slice(0, 5);

  res.status(200).json(
    new ApiResponse(200, {
      stats: {
        applications: applications.length,
        shortlisted: statusCounts.SHORTLISTED || 0,
        interviews: interviews.length,
        offers: statusCounts.SELECTED || 0,
      },
      profileCompletion: profile.profileCompletion,
      recentApplications,
      upcomingInterviews,
      recommendedJobs,
      charts: {
        applicationStatus: Object.entries(statusCounts).map(([status, count]) => ({ status, count })),
        monthlyApplications,
        skillsDistribution,
      },
    })
  );
});

module.exports = { getMyProfile, updateMyProfile, getDashboardStats };
