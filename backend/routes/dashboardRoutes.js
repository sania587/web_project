const express = require('express');
const router = express.Router();
const WorkoutPlan = require('../models/WorkoutPlan');
const DietPlan = require('../models/DietPlan');
const Progress = require('../models/Progress');
const Trainer = require('../models/Trainer');
const { protect } = require('../middleware/authMiddleware'); // Assuming you want protection

// GET /api/dashboard/plans
// Fetch assigned workout and diet plans for the logged-in user
router.get('/plans', protect, async (req, res) => {
  try {
    const userId = req.user.id;

    // Find plans where 'assignedTo' array contains the user's ID
    const workoutPlan = await WorkoutPlan.findOne({ assignedTo: userId });
    const dietPlan = await DietPlan.findOne({ assignedTo: userId });

    res.json({
      workoutPlan: workoutPlan ? workoutPlan.name : null,
      dietPlan: dietPlan ? dietPlan.name : null,
      // You can return full objects if the frontend needs more details later
    });
  } catch (error) {
    console.error('Error fetching plans:', error);
    res.status(500).json({ message: 'Server error fetching plans' });
  }
});

// GET /api/dashboard/progress
// Fetch progress reports for the logged-in user
router.get('/progress', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const reports = await Progress.find({ user: userId }).sort({ date: -1 }); // Sort by newest first
    res.json(reports);
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ message: 'Server error fetching progress' });
  }
});

// GET /api/dashboard/trainers
// Fetch all trainers
router.get('/trainers', protect, async (req, res) => {
  try {
    const trainers = await Trainer.find({}).lean();

    const formattedTrainers = trainers.map(trainer => {
      // Calculate average rating
      let avgRating = 0;
      if (trainer.feedback && trainer.feedback.length > 0) {
        const sum = trainer.feedback.reduce((acc, curr) => acc + curr.rating, 0);
        avgRating = (sum / trainer.feedback.length).toFixed(1);
      }

      // Handle dual schema possibilities for specializations
      const specializations = trainer.profileDetails?.specializations || 
                              (trainer.specialization ? [trainer.specialization] : []) || 
                              [];

      return {
        id: trainer._id,
        name: trainer.name,
        email: trainer.email,
        specializations: specializations,
        availability: trainer.availability || [],
        rating: avgRating
      };
    });

    res.json(formattedTrainers);
  } catch (error) {
    console.error('Error fetching trainers:', error);
    res.status(500).json({ message: 'Server error fetching trainers' });
  }
});

module.exports = router;
