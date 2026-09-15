const express = require('express');
const router = express.Router();
const jobController = require('../controllers/job.controller');
const applicationController = require('../controllers/application.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { createJobValidator, applyJobValidator } = require('../validators/job.validator');

router.get('/saved/list', protect, authorize('STUDENT'), jobController.getSavedJobs);

router.get('/', protect, jobController.getJobs);
router.post('/', protect, authorize('RECRUITER'), createJobValidator, validate, jobController.createJob);

router.get('/:id', protect, jobController.getJobById);
router.put('/:id', protect, authorize('RECRUITER', 'ADMIN'), jobController.updateJob);
router.delete('/:id', protect, authorize('RECRUITER', 'ADMIN'), jobController.deleteJob);
router.patch('/:id/status', protect, authorize('RECRUITER', 'ADMIN'), jobController.updateJobStatus);

router.post('/:id/save', protect, authorize('STUDENT'), jobController.toggleSaveJob);
router.post('/:id/apply', protect, authorize('STUDENT'), applyJobValidator, validate, applicationController.applyToJob);

module.exports = router;
