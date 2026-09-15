const asyncHandler = require('express-async-handler');
const Notification = require('../models/Notification');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const { notifyMany } = require('../services/notification.service');

// @route GET /api/notifications
const getMyNotifications = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, unreadOnly } = req.query;
  const filter = { recipient: req.user._id };
  if (unreadOnly === 'true') filter.isRead = false;

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.max(1, parseInt(limit, 10));

  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find(filter).sort('-createdAt').skip((pageNum - 1) * limitNum).limit(limitNum),
    Notification.countDocuments(filter),
    Notification.countDocuments({ recipient: req.user._id, isRead: false }),
  ]);

  res.status(200).json(
    new ApiResponse(200, {
      notifications,
      unreadCount,
      pagination: { total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) },
    })
  );
});

// @route PUT /api/notifications/:id/read
const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, recipient: req.user._id },
    { isRead: true },
    { new: true }
  );
  if (!notification) throw new ApiError(404, 'Notification not found.');
  res.status(200).json(new ApiResponse(200, notification));
});

// @route PUT /api/notifications/read-all
const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ recipient: req.user._id, isRead: false }, { isRead: true });
  res.status(200).json(new ApiResponse(200, {}, 'All notifications marked as read.'));
});

// @route DELETE /api/notifications/:id
const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndDelete({ _id: req.params.id, recipient: req.user._id });
  if (!notification) throw new ApiError(404, 'Notification not found.');
  res.status(200).json(new ApiResponse(200, {}, 'Notification deleted.'));
});

// @route POST /api/notifications/announcement (admin broadcast)
const createAnnouncement = asyncHandler(async (req, res) => {
  const { title, message, audience } = req.body; // audience: 'ALL' | 'STUDENT' | 'RECRUITER'
  if (!title || !message) throw new ApiError(400, 'Title and message are required.');

  const filter = audience && audience !== 'ALL' ? { role: audience } : {};
  const users = await User.find(filter).select('_id');
  const userIds = users.map((u) => u._id);

  await notifyMany(userIds, { title, message, type: 'ANNOUNCEMENT' });

  res.status(201).json(new ApiResponse(201, { recipients: userIds.length }, 'Announcement sent successfully.'));
});

module.exports = { getMyNotifications, markAsRead, markAllAsRead, deleteNotification, createAnnouncement };
