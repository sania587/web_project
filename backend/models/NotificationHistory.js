const mongoose = require('mongoose');

// NotificationHistory Schema - Stores admin-sent notification history
const NotificationHistorySchema = new mongoose.Schema({
  message: { 
    type: String, 
    required: true 
  },
  sentTo: { 
    type: String, 
    enum: ['all', 'users', 'trainers', 'individual'],
    required: true 
  },
  recipientCount: { 
    type: Number, 
    default: 1 
  },
  // For individual notifications, store the recipient details
  recipientId: { 
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'recipientModel'
  },
  recipientModel: {
    type: String,
    enum: ['User', 'Trainer']
  },
  recipientName: {
    type: String
  },
  sentBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Admin'
  },
  status: { 
    type: String, 
    enum: ['sent', 'failed'],
    default: 'sent' 
  }
}, { timestamps: true });

module.exports = mongoose.model('NotificationHistory', NotificationHistorySchema);
