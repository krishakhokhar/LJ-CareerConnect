const express = require('express');
const router = express.Router();
const recruiterController = require('../controllers/recruiter.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect, authorize('RECRUITER'));

router.get('/profile', recruiterController.getMyProfile);
router.put('/profile', recruiterController.updateMyProfile);
router.get('/dashboard', recruiterController.getDashboardStats);
router.get('/applicants', recruiterController.getApplicants);

module.exports = router;
