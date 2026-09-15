const asyncHandler = require('express-async-handler');
const Skill = require('../models/Skill');
const StudentProfile = require('../models/StudentProfile');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

const getMyProfileId = async (userId) => {
  const profile = await StudentProfile.findOne({ user: userId });
  if (!profile) throw new ApiError(404, 'Student profile not found.');
  return profile._id;
};

// @route GET /api/skills
const getMySkills = asyncHandler(async (req, res) => {
  const studentId = await getMyProfileId(req.user._id);
  const skills = await Skill.find({ student: studentId }).sort('category name');
  res.status(200).json(new ApiResponse(200, skills));
});

// @route POST /api/skills
const addSkill = asyncHandler(async (req, res) => {
  const studentId = await getMyProfileId(req.user._id);
  const { name, category, level } = req.body;
  if (!name) throw new ApiError(400, 'Skill name is required.');

  const existing = await Skill.findOne({ student: studentId, name: new RegExp(`^${name.trim()}$`, 'i') });
  if (existing) throw new ApiError(409, 'This skill is already in your profile.');

  const skill = await Skill.create({ student: studentId, name, category, level });
  res.status(201).json(new ApiResponse(201, skill, 'Skill added successfully.'));
});

// @route PUT /api/skills/:id
const updateSkill = asyncHandler(async (req, res) => {
  const studentId = await getMyProfileId(req.user._id);
  const skill = await Skill.findOne({ _id: req.params.id, student: studentId });
  if (!skill) throw new ApiError(404, 'Skill not found.');

  ['name', 'category', 'level'].forEach((field) => {
    if (req.body[field] !== undefined) skill[field] = req.body[field];
  });
  await skill.save();
  res.status(200).json(new ApiResponse(200, skill, 'Skill updated successfully.'));
});

// @route DELETE /api/skills/:id
const deleteSkill = asyncHandler(async (req, res) => {
  const studentId = await getMyProfileId(req.user._id);
  const skill = await Skill.findOneAndDelete({ _id: req.params.id, student: studentId });
  if (!skill) throw new ApiError(404, 'Skill not found.');
  res.status(200).json(new ApiResponse(200, {}, 'Skill removed.'));
});

module.exports = { getMySkills, addSkill, updateSkill, deleteSkill };
