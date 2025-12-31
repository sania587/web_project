const mongoose = require('mongoose');

// SessionRequest Schema - Stores session booking requests from customers to trainers
const SessionRequestSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trainer',
    required: true
  },
  message: {
    type: String,
    default: ''
  },
  preferredDate: {
    type: Date
  },
  preferredTime: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'scheduled', 'completed', 'cancelled'],
    default: 'pending'
  },
  trainerResponse: {
    type: String,
    default: ''
  },
  scheduledDate: {
    type: Date
  },
  scheduledTime: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('SessionRequest', SessionRequestSchema);
