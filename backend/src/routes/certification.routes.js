const express = require('express');
const router = express.Router();
const certificationController = require('../controllers/certification.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const { uploadCertificate } = require('../middleware/upload.middleware');

router.use(protect, authorize('STUDENT'));

router.get('/', certificationController.getMyCertifications);
router.post('/', uploadCertificate, certificationController.addCertification);
router.delete('/:id', certificationController.deleteCertification);

module.exports = router;
