const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Add a notification for a user/trainer
router.post('/:userId', notificationController.addNotification);

// Get all notifications for a user/trainer
router.get('/:userId', notificationController.getNotificationsForUser);

// Notification History Routes (for admin panel)
router.post('/history/save', notificationController.saveNotificationHistory);
router.get('/history/all', notificationController.getNotificationHistory);
router.delete('/history/:id', notificationController.deleteNotificationHistory);

module.exports = router;

