const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.get('/', protect, notificationController.getMyNotifications);
router.put('/read-all', protect, notificationController.markAllAsRead);
router.put('/:id/read', protect, notificationController.markAsRead);
router.delete('/:id', protect, notificationController.deleteNotification);
router.post('/announcement', protect, authorize('ADMIN'), notificationController.createAnnouncement);

module.exports = router;
