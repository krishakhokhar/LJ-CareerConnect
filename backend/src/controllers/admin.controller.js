const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const RecruiterProfile = require('../models/RecruiterProfile');
const Company = require('../models/Company');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Internship = require('../models/Internship');
const PlacementDrive = require('../models/PlacementDrive');
const Alumni = require('../models/Alumni');
const Skill = require('../models/Skill');
const Certification = require('../models/Certification');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

// @route GET /api/admin/dashboard
const getDashboardStats = asyncHandler(async (req, res) => {
  const [
    totalStudents,
    totalRecruiters,
    totalCompanies,
    activeJobs,
    totalApplications,
    placements,
    totalInternships,
  ] = await Promise.all([
    StudentProfile.countDocuments(),
    RecruiterProfile.countDocuments(),
    Company.countDocuments(),
    Job.countDocuments({ status: 'PUBLISHED' }),
    Application.countDocuments(),
    Application.countDocuments({ status: 'SELECTED' }),
    Internship.countDocuments(),
  ]);

  const applications = await Application.find({}).populate({ path: 'job', select: 'title salaryMin salaryMax' });
  const statusCounts = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {});

  const monthlyMap = {};
  applications.forEach((app) => {
    const key = new Date(app.createdAt).toLocaleString('default', { month: 'short', year: '2-digit' });
    monthlyMap[key] = (monthlyMap[key] || 0) + 1;
  });

  const students = await StudentProfile.find({}).select('department isPlaced');
  const deptMap = {};
  students.forEach((s) => {
    if (!deptMap[s.department]) deptMap[s.department] = { department: s.department, total: 0, placed: 0 };
    deptMap[s.department].total += 1;
    if (s.isPlaced) deptMap[s.department].placed += 1;
  });
  const departmentWisePlacement = Object.values(deptMap).map((d) => ({
    ...d,
    percentage: d.total ? Math.round((d.placed / d.total) * 100) : 0,
  }));

  const selectedApps = applications.filter((a) => a.status === 'SELECTED' && a.job);
  const companyHiringMap = {};
  const jobsForCompanyLookup = await Job.find({ _id: { $in: selectedApps.map((a) => a.job._id) } }).populate('company', 'name');
  jobsForCompanyLookup.forEach((job) => {
    const name = job.company?.name || 'Unknown';
    companyHiringMap[name] = (companyHiringMap[name] || 0) + 1;
  });

  const salaryRanges = { '0-3 LPA': 0, '3-6 LPA': 0, '6-10 LPA': 0, '10+ LPA': 0 };
  selectedApps.forEach((app) => {
    const avgSalary = ((app.job.salaryMin || 0) + (app.job.salaryMax || 0)) / 2 / 100000;
    if (avgSalary <= 3) salaryRanges['0-3 LPA'] += 1;
    else if (avgSalary <= 6) salaryRanges['3-6 LPA'] += 1;
    else if (avgSalary <= 10) salaryRanges['6-10 LPA'] += 1;
    else salaryRanges['10+ LPA'] += 1;
  });

  res.status(200).json(
    new ApiResponse(200, {
      stats: {
        totalStudents,
        totalRecruiters,
        totalCompanies,
        activeJobs,
        totalApplications,
        placements,
        totalInternships,
        placementPercentage: totalStudents ? Math.round((placements / totalStudents) * 100) : 0,
      },
      charts: {
        departmentWisePlacement,
        companyWiseHiring: Object.entries(companyHiringMap).map(([company, count]) => ({ company, count })),
        placementPercentage: departmentWisePlacement.map((d) => ({ department: d.department, percentage: d.percentage })),
        monthlyApplications: Object.entries(monthlyMap).map(([month, count]) => ({ month, count })),
        applicationStatus: Object.entries(statusCounts).map(([status, count]) => ({ status, count })),
        salaryAnalytics: Object.entries(salaryRanges).map(([range, count]) => ({ range, count })),
      },
    })
  );
});

// @route GET /api/admin/students
const getStudents = asyncHandler(async (req, res) => {
  const { search, department, course, page = 1, limit = 15 } = req.query;
  const filter = {};
  if (search) filter.$or = [{ fullName: new RegExp(search, 'i') }, { studentId: new RegExp(search, 'i') }];
  if (department) filter.department = department;
  if (course) filter.course = course;

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.max(1, parseInt(limit, 10));

  const [students, total] = await Promise.all([
    StudentProfile.find(filter)
      .populate('user', 'email isActive lastLoginAt')
      .sort('-createdAt')
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    StudentProfile.countDocuments(filter),
  ]);

  res.status(200).json(
    new ApiResponse(200, { students, pagination: { total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) } })
  );
});

// @route PUT /api/admin/students/:id/status
const toggleStudentStatus = asyncHandler(async (req, res) => {
  const profile = await StudentProfile.findById(req.params.id);
  if (!profile) throw new ApiError(404, 'Student not found.');
  const user = await User.findById(profile.user);
  user.isActive = !user.isActive;
  await user.save();
  res.status(200).json(new ApiResponse(200, { isActive: user.isActive }, 'Student status updated.'));
});

// @route GET /api/admin/recruiters
const getRecruiters = asyncHandler(async (req, res) => {
  const { search, page = 1, limit = 15 } = req.query;
  const filter = {};
  if (search) filter.recruiterName = new RegExp(search, 'i');

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.max(1, parseInt(limit, 10));

  const [recruiters, total] = await Promise.all([
    RecruiterProfile.find(filter)
      .populate('user', 'email isActive lastLoginAt')
      .populate('company', 'name location isVerified')
      .sort('-createdAt')
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    RecruiterProfile.countDocuments(filter),
  ]);

  res.status(200).json(
    new ApiResponse(200, { recruiters, pagination: { total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) } })
  );
});

// @route PUT /api/admin/recruiters/:id/status
const toggleRecruiterStatus = asyncHandler(async (req, res) => {
  const profile = await RecruiterProfile.findById(req.params.id);
  if (!profile) throw new ApiError(404, 'Recruiter not found.');
  const user = await User.findById(profile.user);
  user.isActive = !user.isActive;
  await user.save();
  res.status(200).json(new ApiResponse(200, { isActive: user.isActive }, 'Recruiter status updated.'));
});

// @route PUT /api/admin/companies/:id/verify
const verifyCompany = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);
  if (!company) throw new ApiError(404, 'Company not found.');
  company.isVerified = !company.isVerified;
  await company.save();
  res.status(200).json(new ApiResponse(200, company, 'Company verification status updated.'));
});

// @route GET /api/admin/reports
const getReports = asyncHandler(async (req, res) => {
  const [studentCount, placedCount, alumniCount, driveCount, internshipApplications] = await Promise.all([
    StudentProfile.countDocuments(),
    StudentProfile.countDocuments({ isPlaced: true }),
    Alumni.countDocuments(),
    PlacementDrive.countDocuments(),
    Application.countDocuments(),
  ]);

  res.status(200).json(
    new ApiResponse(200, {
      studentCount,
      placedCount,
      unplacedCount: studentCount - placedCount,
      alumniCount,
      driveCount,
      internshipApplications,
    })
  );
});

// @route GET /api/admin/skills-overview
const getSkillsOverview = asyncHandler(async (req, res) => {
  const [skills, certifications] = await Promise.all([Skill.find({}), Certification.find({}).populate('student', 'fullName')]);

  const categoryMap = {};
  const nameMap = {};
  const levelMap = {};
  skills.forEach((s) => {
    categoryMap[s.category] = (categoryMap[s.category] || 0) + 1;
    nameMap[s.name] = (nameMap[s.name] || 0) + 1;
    levelMap[s.level] = (levelMap[s.level] || 0) + 1;
  });

  const topSkills = Object.entries(nameMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, count]) => ({ name, count }));

  res.status(200).json(
    new ApiResponse(200, {
      totalSkills: skills.length,
      totalCertifications: certifications.length,
      byCategory: Object.entries(categoryMap).map(([category, count]) => ({ category, count })),
      byLevel: Object.entries(levelMap).map(([level, count]) => ({ level, count })),
      topSkills,
      recentCertifications: certifications.sort((a, b) => b.createdAt - a.createdAt).slice(0, 10),
    })
  );
});

module.exports = {
  getDashboardStats,
  getStudents,
  toggleStudentStatus,
  getRecruiters,
  toggleRecruiterStatus,
  verifyCompany,
  getReports,
  getSkillsOverview,
};
