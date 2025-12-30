const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Trainer = require('../models/Trainer');
const { getTrainerProfile, updateTrainerProfile, createWorkoutPlan } = require('../controllers/trainerController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Signup endpoint for trainers
router.post('/signup', async (req, res) => {
  const { name, email, password, expertise, experience, specializations, certifications } = req.body;

  try {
    // Check if the email already exists
    const existingTrainer = await Trainer.findOne({ email });
    if (existingTrainer) {
      return res.status(400).json({ message: 'Trainer with this email already exists.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new trainer instance
    const newTrainer = new Trainer({
      name,
      email,
      password: hashedPassword,
      role: 'trainer',
      profileDetails: {
        specializations: specializations || [],
        certifications: certifications || [],
      },
      specialization: expertise,
    });

    // Save the trainer to the database
    await newTrainer.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: newTrainer._id, email: newTrainer.email, role: 'trainer' },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1d' }
    );

    // Send response
    res.status(201).json({
      message: 'Trainer Signup Successful!',
      token,
      trainerId: newTrainer._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong. Please try again later.' });
  }
});

// Protected Trainer Routes
router.get('/profile', authMiddleware, getTrainerProfile);
router.put('/profile', authMiddleware, updateTrainerProfile);
router.post('/plans', authMiddleware, createWorkoutPlan);

module.exports = router;
