const asyncHandler = require('express-async-handler');
const StudentProfile = require('../models/StudentProfile');
const Skill = require('../models/Skill');
const Certification = require('../models/Certification');
const Job = require('../models/Job');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const aiService = require('../services/ai.service');
const { ALL_ROLES } = require('../services/roleSkillMap');

const getStudentContext = async (userId) => {
  const profile = await StudentProfile.findOne({ user: userId });
  if (!profile) throw new ApiError(404, 'Student profile not found.');
  const [skills, certifications] = await Promise.all([
    Skill.find({ student: profile._id }),
    Certification.find({ student: profile._id }),
  ]);
  return { profile, skills, certifications };
};

// @route POST /api/ai/job-match  { jobId }
const jobMatch = asyncHandler(async (req, res) => {
  const { jobId } = req.body;
  if (!jobId) throw new ApiError(400, 'jobId is required.');

  const job = await Job.findById(jobId);
  if (!job) throw new ApiError(404, 'Job not found.');

  const { profile, skills } = await getStudentContext(req.user._id);

  const result = await aiService.jobMatch({
    studentSkills: skills.map((s) => s.name),
    jobSkills: job.skills,
    jobTitle: job.title,
    studentExperienceCount: profile.experience?.length || 0,
  });

  res.status(200).json(new ApiResponse(200, result));
});

// @route POST /api/ai/skill-gap  { targetRole }
const skillGap = asyncHandler(async (req, res) => {
  const { targetRole } = req.body;
  if (!targetRole) throw new ApiError(400, 'targetRole is required.');

  const { skills } = await getStudentContext(req.user._id);

  const result = await aiService.skillGapAnalysis({
    currentSkills: skills.map((s) => s.name),
    targetRole,
  });

  res.status(200).json(new ApiResponse(200, result));
});

// @route POST /api/ai/career-recommendation
const careerRecommendation = asyncHandler(async (req, res) => {
  const { profile, skills, certifications } = await getStudentContext(req.user._id);

  const result = await aiService.careerRecommendation({
    course: profile.course,
    skills: skills.map((s) => s.name),
    certifications,
    projects: profile.projects || [],
    experience: profile.experience || [],
  });

  res.status(200).json(new ApiResponse(200, result));
});

// @route GET /api/ai/roles - list of roles the local KB supports (for the skill-gap role picker)
const getAvailableRoles = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, ALL_ROLES));
});

// @route GET /api/ai/status - whether Gemini is configured (for UI badge)
const getAIStatus = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, { provider: aiService.isGeminiConfigured ? 'gemini' : 'local-demo' }));
});

module.exports = { jobMatch, skillGap, careerRecommendation, getAvailableRoles, getAIStatus };
