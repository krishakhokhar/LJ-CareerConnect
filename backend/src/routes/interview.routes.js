const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interview.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.get('/', protect, interviewController.getInterviews);
router.post('/', protect, authorize('RECRUITER'), interviewController.scheduleInterview);
router.put('/:id', protect, authorize('RECRUITER'), interviewController.updateInterview);

module.exports = router;
