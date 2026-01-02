const mongoose = require('mongoose');

// Define the User Schema with comprehensive fitness profile
const UserSchema = new mongoose.Schema({
  // Basic Info
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer'], required: true },
  phone: { type: String, default: null },
  
  // Profile Picture
  profilePicture: { type: String, default: null },
  
  // Physical Details
  profileDetails: {
    age: { type: Number },
    gender: { type: String, enum: ['Male', 'Female', 'Other', ''] },
    height: { type: Number }, // in cm
    weight: { type: Number }, // in kg
    fitnessLevel: { 
      type: String, 
      enum: ['Beginner', 'Intermediate', 'Advanced', ''],
      default: ''
    },
    healthGoals: { type: String },
    healthConditions: { type: String }, // Allergies, injuries, medical conditions
    preferredWorkoutTime: {
      type: String,
      enum: ['Morning', 'Afternoon', 'Evening', 'Flexible', ''],
      default: ''
    }
  },
  
  // Emergency Contact
  emergencyContact: {
    name: { type: String, default: null },
    phone: { type: String, default: null },
    relationship: { type: String, default: null }
  },
  
  // Subscription
  subscription: {
    plan: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription' },
    startDate: { type: Date },
    endDate: { type: Date },
    status: { type: String, enum: ['active', 'pending', 'expired', 'cancelled', 'none'], default: 'none' },
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' }
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

module.exports = mongoose.model('User', UserSchema);
