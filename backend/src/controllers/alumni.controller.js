const asyncHandler = require('express-async-handler');
const Alumni = require('../models/Alumni');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

// @route GET /api/alumni
const getAlumni = asyncHandler(async (req, res) => {
  const { search, department, graduationYear, page = 1, limit = 12 } = req.query;
  const filter = {};

  if (search) {
    filter.$or = [
      { name: new RegExp(search, 'i') },
      { company: new RegExp(search, 'i') },
      { jobRole: new RegExp(search, 'i') },
    ];
  }
  if (department) filter.department = department;
  if (graduationYear) filter.graduationYear = Number(graduationYear);

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.max(1, parseInt(limit, 10));

  const [alumni, total] = await Promise.all([
    Alumni.find(filter).sort('-graduationYear').skip((pageNum - 1) * limitNum).limit(limitNum),
    Alumni.countDocuments(filter),
  ]);

  res.status(200).json(
    new ApiResponse(200, {
      alumni,
      pagination: { total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) },
    })
  );
});

// @route GET /api/alumni/analytics
const getAlumniAnalytics = asyncHandler(async (req, res) => {
  const alumni = await Alumni.find({});

  const byYear = {};
  const byCompany = {};
  const byDepartment = {};
  let totalPackage = 0;

  alumni.forEach((a) => {
    byYear[a.graduationYear] = (byYear[a.graduationYear] || 0) + 1;
    byCompany[a.company] = (byCompany[a.company] || 0) + 1;
    byDepartment[a.department] = (byDepartment[a.department] || 0) + 1;
    totalPackage += a.salaryPackage;
  });

  res.status(200).json(
    new ApiResponse(200, {
      totalAlumni: alumni.length,
      averagePackage: alumni.length ? Math.round((totalPackage / alumni.length) * 100) / 100 : 0,
      byYear: Object.entries(byYear).map(([year, count]) => ({ year, count })),
      byCompany: Object.entries(byCompany)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([company, count]) => ({ company, count })),
      byDepartment: Object.entries(byDepartment).map(([department, count]) => ({ department, count })),
    })
  );
});

// @route POST /api/alumni
const createAlumni = asyncHandler(async (req, res) => {
  const alumni = await Alumni.create(req.body);
  res.status(201).json(new ApiResponse(201, alumni, 'Alumni record added successfully.'));
});

// @route PUT /api/alumni/:id
const updateAlumni = asyncHandler(async (req, res) => {
  const alumni = await Alumni.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!alumni) throw new ApiError(404, 'Alumni record not found.');
  res.status(200).json(new ApiResponse(200, alumni, 'Alumni record updated successfully.'));
});

// @route DELETE /api/alumni/:id
const deleteAlumni = asyncHandler(async (req, res) => {
  const alumni = await Alumni.findByIdAndDelete(req.params.id);
  if (!alumni) throw new ApiError(404, 'Alumni record not found.');
  res.status(200).json(new ApiResponse(200, {}, 'Alumni record deleted.'));
});

module.exports = { getAlumni, getAlumniAnalytics, createAlumni, updateAlumni, deleteAlumni };
