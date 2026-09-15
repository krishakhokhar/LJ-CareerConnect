const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/application.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.get('/', protect, applicationController.getApplications);
router.get('/:id', protect, applicationController.getApplicationById);
router.put('/:id/status', protect, authorize('RECRUITER', 'ADMIN'), applicationController.updateApplicationStatus);

module.exports = router;
