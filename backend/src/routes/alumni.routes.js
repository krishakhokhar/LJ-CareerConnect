const express = require('express');
const router = express.Router();
const alumniController = require('../controllers/alumni.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.get('/', protect, alumniController.getAlumni);
router.get('/analytics', protect, alumniController.getAlumniAnalytics);
router.post('/', protect, authorize('ADMIN'), alumniController.createAlumni);
router.put('/:id', protect, authorize('ADMIN'), alumniController.updateAlumni);
router.delete('/:id', protect, authorize('ADMIN'), alumniController.deleteAlumni);

module.exports = router;
