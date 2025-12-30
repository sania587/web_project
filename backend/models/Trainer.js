const mongoose = require('mongoose');

// Define the Trainer Schema - Combined from both branches
const TrainerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['trainer'], required: true },
  
  // Profile details for trainers
  profileDetails: {
    age: Number,
    gender: String,
    specializations: [String], // Trainer expertise areas
    certifications: [String], // Trainer certifications
  },
  
  // Specialization and availability from trainer branch
  specialization: { type: String },
  availability: { type: [String] }, // Time slots
  
  notifications: [{ type: String }],
  feedback: [
    { 
      from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      message: String,
      rating: Number
    }
  ],
  
  // Password reset functionality
  resetToken: { 
    type: String, 
    default: null 
  },
  resetTokenExpiration: { 
    type: Date, 
    default: null 
  },
}, { timestamps: true });

module.exports = mongoose.model('Trainer', TrainerSchema);
