const asyncHandler = require('express-async-handler');
const Company = require('../models/Company');
const Job = require('../models/Job');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

// @route GET /api/companies
const getCompanies = asyncHandler(async (req, res) => {
  const { search } = req.query;
  const filter = {};
  if (search) filter.name = new RegExp(search, 'i');

  const companies = await Company.find(filter).sort('name');
  res.status(200).json(new ApiResponse(200, companies));
});

// @route GET /api/companies/:id
const getCompanyById = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);
  if (!company) throw new ApiError(404, 'Company not found.');

  const jobs = await Job.find({ company: company._id, status: 'PUBLISHED' });
  res.status(200).json(new ApiResponse(200, { company, activeJobs: jobs.length }));
});

// @route PUT /api/companies/:id (admin)
const updateCompany = asyncHandler(async (req, res) => {
  const company = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!company) throw new ApiError(404, 'Company not found.');
  res.status(200).json(new ApiResponse(200, company, 'Company updated successfully.'));
});

// @route DELETE /api/companies/:id (admin)
const deleteCompany = asyncHandler(async (req, res) => {
  const company = await Company.findByIdAndDelete(req.params.id);
  if (!company) throw new ApiError(404, 'Company not found.');
  res.status(200).json(new ApiResponse(200, {}, 'Company deleted.'));
});

module.exports = { getCompanies, getCompanyById, updateCompany, deleteCompany };
