const Notification = require('../models/Notification');

/**
 * Creates a notification for a single recipient.
 */
const notify = async ({ recipient, title, message, type = 'SYSTEM', link = '' }) => {
  return Notification.create({ recipient, title, message, type, link });
};

/**
 * Creates the same notification for multiple recipients.
 */
const notifyMany = async (recipientIds = [], { title, message, type = 'SYSTEM', link = '' }) => {
  if (!recipientIds.length) return [];
  const docs = recipientIds.map((recipient) => ({ recipient, title, message, type, link }));
  return Notification.insertMany(docs);
};

module.exports = { notify, notifyMany };
