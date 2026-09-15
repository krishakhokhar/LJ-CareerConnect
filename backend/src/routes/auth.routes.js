const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const { authLimiter } = require('../middleware/rateLimiter.middleware');
const validate = require('../middleware/validate.middleware');
const {
  registerStudentValidator,
  registerRecruiterValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} = require('../validators/auth.validator');

router.post('/register/student', authLimiter, registerStudentValidator, validate, authController.registerStudent);
router.post('/register/recruiter', authLimiter, registerRecruiterValidator, validate, authController.registerRecruiter);
router.post('/login', authLimiter, loginValidator, validate, authController.login);
router.get('/me', protect, authController.getMe);
router.post('/forgot-password', authLimiter, forgotPasswordValidator, validate, authController.forgotPassword);
router.post('/reset-password', authLimiter, resetPasswordValidator, validate, authController.resetPassword);
router.post('/logout', protect, authController.logout);

// TODO(Google OAuth): Not implemented yet. The frontend "Continue with Google"
// button is visual-only and shows an informational toast. To wire it up:
//   1. npm install google-auth-library (or passport + passport-google-oauth20)
//   2. Create OAuth 2.0 credentials in Google Cloud Console, add an
//      authorized redirect URI, and store CLIENT_ID/CLIENT_SECRET in .env
//      (never in frontend code).
//   3. Add POST /api/auth/google here: verify the Google ID token sent by
//      the frontend, find-or-create a User with that email (role must still
//      be chosen by the user - student vs recruiter - since Google doesn't
//      know it), then return a JWT the same way login() does.
//   4. Point the frontend's GoogleAuthButton onClick at Google Identity
//      Services (One Tap / OAuth code flow) instead of the current toast.

module.exports = router;
