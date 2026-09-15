const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resume.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const { uploadResume } = require('../middleware/upload.middleware');

router.use(protect, authorize('STUDENT'));

router.post('/upload', uploadResume, resumeController.uploadResume);
router.delete('/', resumeController.deleteResume);

module.exports = router;
