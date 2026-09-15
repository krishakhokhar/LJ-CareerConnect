const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const { aiLimiter } = require('../middleware/rateLimiter.middleware');

router.use(protect, authorize('STUDENT'), aiLimiter);

router.get('/status', aiController.getAIStatus);
router.get('/roles', aiController.getAvailableRoles);
router.post('/job-match', aiController.jobMatch);
router.post('/skill-gap', aiController.skillGap);
router.post('/career-recommendation', aiController.careerRecommendation);

module.exports = router;
