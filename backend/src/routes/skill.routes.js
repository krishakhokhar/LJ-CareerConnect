const express = require('express');
const router = express.Router();
const skillController = require('../controllers/skill.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect, authorize('STUDENT'));

router.get('/', skillController.getMySkills);
router.post('/', skillController.addSkill);
router.put('/:id', skillController.updateSkill);
router.delete('/:id', skillController.deleteSkill);

module.exports = router;
