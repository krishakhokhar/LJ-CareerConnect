const { body } = require('express-validator');

const createJobValidator = [
  body('title').trim().notEmpty().withMessage('Job title is required'),
  body('description').trim().notEmpty().withMessage('Job description is required'),
  body('skills').isArray({ min: 1 }).withMessage('At least one required skill must be listed'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('jobType').isIn(['Full-time', 'Part-time', 'Internship', 'Contract']).withMessage('Invalid job type'),
  body('salaryMin').isFloat({ min: 0 }).withMessage('Minimum salary must be a positive number'),
  body('salaryMax').isFloat({ min: 0 }).withMessage('Maximum salary must be a positive number')
    .custom((value, { req }) => {
      if (Number(value) < Number(req.body.salaryMin)) {
        throw new Error('Maximum salary must be greater than or equal to minimum salary');
      }
      return true;
    }),
  body('openings').isInt({ min: 1 }).withMessage('Openings must be at least 1'),
  body('applicationDeadline').isISO8601().withMessage('A valid application deadline is required')
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error('Application deadline must be in the future');
      }
      return true;
    }),
];

const applyJobValidator = [
  body('coverNote').optional({ checkFalsy: true }).trim().isLength({ max: 1000 }),
];

module.exports = { createJobValidator, applyJobValidator };
