const mongoose = require('mongoose');

// Define the User Schema
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: [ 'customer'], required: true },
  profileDetails: {
    age: Number,
    gender: String,
    healthGoals: String // For customers
  },
  profilePicture: { type: String, default: null }, // URL to profile image
  subscription: {
    plan: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription' },
    startDate: { type: Date },
    endDate: { type: Date },
    status: { type: String, enum: ['active', 'pending', 'expired', 'cancelled', 'none'], default: 'none' },
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' }
  },
  notifications: [{ type: String }], // Notifications
  feedback: [
    { 
      from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      message: String,
      rating: Number
    }
  ],
  
  // Additional fields for password reset functionality
  resetToken: { 
    type: String, 
    default: null 
  },
  resetTokenExpiration: { 
    type: Date, 
    default: null 
  },
  blocked: { 
    type: Boolean, 
    default: false 
  },
}, { timestamps: true });

// Create and export the User model
module.exports = mongoose.model('User', UserSchema);
