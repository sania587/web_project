const User = require('../models/User');
const Trainer = require('../models/Trainer');
const NotificationHistory = require('../models/NotificationHistory');

// Add a notification for a user or trainer
const addNotification = async (req, res) => {
  try {
    const { message } = req.body;
    let recipient = await User.findById(req.params.userId);

    if (!recipient) {
      recipient = await Trainer.findById(req.params.userId);
    }

    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found' });
    }

    recipient.notifications.push(message);
    await recipient.save();

    res.status(200).json({ message: 'Notification added successfully', notifications: recipient.notifications });
  } catch (err) {
    res.status(500).json({ message: 'Error adding notification', error: err.message });
  }
};

// Get all notifications for a user or trainer
const getNotificationsForUser = async (req, res) => {
  try {
    let recipient = await User.findById(req.params.userId);

    if (!recipient) {
      recipient = await Trainer.findById(req.params.userId);
    }

    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found' });
    }

    res.status(200).json({ notifications: recipient.notifications });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching notifications', error: err.message });
  }
};

// Save notification history (for admin panel)
const saveNotificationHistory = async (req, res) => {
  try {
    const { message, sentTo, recipientCount, recipientId, recipientName, recipientModel } = req.body;
    
    const history = new NotificationHistory({
      message,
      sentTo,
      recipientCount: recipientCount || 1,
      recipientId: sentTo === 'individual' ? recipientId : undefined,
      recipientName: sentTo === 'individual' ? recipientName : undefined,
      recipientModel: sentTo === 'individual' ? recipientModel : undefined
    });
    
    await history.save();
    
    res.status(201).json({ 
      message: 'Notification history saved', 
      history 
    });
  } catch (err) {
    res.status(500).json({ message: 'Error saving notification history', error: err.message });
  }
};

// Get notification history (for admin panel)
const getNotificationHistory = async (req, res) => {
  try {
    const history = await NotificationHistory.find()
      .sort({ createdAt: -1 })
      .limit(50); // Last 50 notifications
    
    res.status(200).json(history);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching notification history', error: err.message });
  }
};

// Delete notification history entry
const deleteNotificationHistory = async (req, res) => {
  try {
    const { id } = req.params;
    await NotificationHistory.findByIdAndDelete(id);
    res.status(200).json({ message: 'Notification history deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting notification history', error: err.message });
  }
};

module.exports = {
  addNotification,
  getNotificationsForUser,
  saveNotificationHistory,
  getNotificationHistory,
  deleteNotificationHistory
};

