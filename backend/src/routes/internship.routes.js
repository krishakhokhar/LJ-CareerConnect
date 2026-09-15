const express = require('express');
const router = express.Router();
const internshipController = require('../controllers/internship.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const { uploadCertificate } = require('../middleware/upload.middleware');

router.get('/my/applications', protect, authorize('STUDENT'), internshipController.getMyInternshipApplications);
router.put('/applications/:id/status', protect, authorize('RECRUITER', 'ADMIN'), internshipController.updateInternshipApplicationStatus);
router.post('/applications/:id/documents', protect, authorize('STUDENT'), uploadCertificate, internshipController.uploadInternshipDocument);

router.get('/', protect, internshipController.getInternships);
router.post('/', protect, authorize('RECRUITER'), internshipController.createInternship);
router.get('/:id', protect, internshipController.getInternshipById);
router.put('/:id', protect, authorize('RECRUITER', 'ADMIN'), internshipController.updateInternship);
router.delete('/:id', protect, authorize('RECRUITER', 'ADMIN'), internshipController.deleteInternship);
router.post('/:id/apply', protect, authorize('STUDENT'), internshipController.applyToInternship);
router.get('/:id/applicants', protect, authorize('RECRUITER', 'ADMIN'), internshipController.getInternshipApplicants);

module.exports = router;
