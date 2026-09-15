const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth.routes'));
router.use('/students', require('./student.routes'));
router.use('/recruiters', require('./recruiter.routes'));
router.use('/admin', require('./admin.routes'));
router.use('/jobs', require('./job.routes'));
router.use('/applications', require('./application.routes'));
router.use('/interviews', require('./interview.routes'));
router.use('/placement-drives', require('./placementDrive.routes'));
router.use('/internships', require('./internship.routes'));
router.use('/skills', require('./skill.routes'));
router.use('/certifications', require('./certification.routes'));
router.use('/resume', require('./resume.routes'));
router.use('/ai', require('./ai.routes'));
router.use('/alumni', require('./alumni.routes'));
router.use('/notifications', require('./notification.routes'));
router.use('/companies', require('./company.routes'));

router.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'LJ CareerConnect API is running.' });
});

module.exports = router;
