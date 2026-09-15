const { body } = require('express-validator');

const registerStudentValidator = [
  body('fullName').trim().notEmpty().withMessage('Full name is required'),
  body('email').trim().isEmail().withMessage('A valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('studentId').trim().notEmpty().withMessage('Student ID is required'),
  body('course').trim().notEmpty().withMessage('Course is required'),
  body('department').trim().notEmpty().withMessage('Department is required'),
  body('semester').isInt({ min: 1, max: 12 }).withMessage('Semester must be between 1 and 12'),
  body('graduationYear').isInt({ min: 2000, max: 2100 }).withMessage('Valid graduation year is required'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
];

const registerRecruiterValidator = [
  body('recruiterName').trim().notEmpty().withMessage('Recruiter name is required'),
  body('companyName').trim().notEmpty().withMessage('Company name is required'),
  body('officialEmail').trim().isEmail().withMessage('A valid official email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('companyWebsite').optional({ checkFalsy: true }).trim(),
  body('companyDescription').optional({ checkFalsy: true }).trim(),
  body('companyLocation').trim().notEmpty().withMessage('Company location is required'),
];

const loginValidator = [
  body('email').trim().isEmail().withMessage('A valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

const forgotPasswordValidator = [
  body('email').trim().isEmail().withMessage('A valid email is required').normalizeEmail(),
];

const resetPasswordValidator = [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

module.exports = {
  registerStudentValidator,
  registerRecruiterValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
};
