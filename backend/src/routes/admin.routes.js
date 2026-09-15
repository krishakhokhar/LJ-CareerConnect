const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect, authorize('ADMIN'));

router.get('/dashboard', adminController.getDashboardStats);
router.get('/students', adminController.getStudents);
router.put('/students/:id/status', adminController.toggleStudentStatus);
router.get('/recruiters', adminController.getRecruiters);
router.put('/recruiters/:id/status', adminController.toggleRecruiterStatus);
router.put('/companies/:id/verify', adminController.verifyCompany);
router.get('/reports', adminController.getReports);
router.get('/skills-overview', adminController.getSkillsOverview);

module.exports = router;
