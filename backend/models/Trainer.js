const mongoose = require('mongoose');

// Define the Trainer Schema with comprehensive professional profile
const TrainerSchema = new mongoose.Schema({
  // Basic Info
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['trainer'], required: true },
  phone: { type: String, default: null },
  
  // Profile Picture
  profilePicture: { type: String, default: null },
  
  // Professional Details
  bio: { type: String, default: null }, // Short description
  hourlyRate: { type: Number, default: null }, // Price per session
  yearsExperience: { type: Number, default: 0 },
  languages: [{ type: String }], // e.g., ['English', 'Spanish']
  
  // Profile details
  profileDetails: {
    age: { type: Number },
    gender: { type: String, enum: ['Male', 'Female', 'Other', ''] },
    specializations: [{ type: String }], // e.g., ['Weight Training', 'HIIT', 'Yoga']
    certifications: [{ type: String }], // e.g., ['ACE', 'NASM', 'CrossFit Level 1']
  },
  
  // Legacy fields (keeping for compatibility)
  specialization: { type: String },
  availability: [{ type: String }], // Time slots
  
  // Social Links
  socialLinks: {
    instagram: { type: String, default: null },
    linkedin: { type: String, default: null },
    youtube: { type: String, default: null },
    website: { type: String, default: null }
  },
  
  // Notifications & Feedback
  notifications: [{ type: String }],
  feedback: [{ 
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: String,
    rating: Number
  }],
  
  // Password Reset
  resetToken: { type: String, default: null },
  resetTokenExpiration: { type: Date, default: null },
  
  // Account Status
  blocked: { type: Boolean, default: false },
  
}, { timestamps: true });

module.exports = mongoose.model('Trainer', TrainerSchema);
