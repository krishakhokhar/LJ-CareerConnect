const express = require('express');
const router = express.Router();
const studentController = require('../controllers/student.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect, authorize('STUDENT'));

router.get('/profile', studentController.getMyProfile);
router.put('/profile', studentController.updateMyProfile);
router.get('/dashboard', studentController.getDashboardStats);

module.exports = router;
