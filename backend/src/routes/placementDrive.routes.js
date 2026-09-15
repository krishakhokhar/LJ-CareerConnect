const express = require('express');
const router = express.Router();
const driveController = require('../controllers/placementDrive.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.get('/', protect, driveController.getDrives);
router.post('/', protect, authorize('ADMIN'), driveController.createDrive);
router.get('/:id', protect, driveController.getDriveById);
router.put('/:id', protect, authorize('ADMIN'), driveController.updateDrive);
router.delete('/:id', protect, authorize('ADMIN'), driveController.deleteDrive);
router.post('/:id/register', protect, authorize('STUDENT'), driveController.registerForDrive);

module.exports = router;
