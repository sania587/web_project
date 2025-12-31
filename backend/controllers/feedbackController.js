const Feedback = require('../models/Feedback');
const User = require('../models/User');

// Controller to get all feedback
const getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find()
      .populate('trainerId', 'name')
      .populate('customerId', 'name');
    res.json(feedback);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ message: 'Failed to fetch feedback' });
  }
};

// Controller to delete feedback
const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    await Feedback.findByIdAndDelete(id);
    res.status(200).json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    res.status(500).json({ message: 'Failed to delete feedback' });
  }
};

// Controller to search feedback by trainer username or customer username
const searchFeedback = async (req, res) => {
  const { trainerUsername, customerUsername, searchType } = req.query;

  try {
    let feedbackQuery = Feedback.find();

    if (searchType === 'trainer' && trainerUsername) {
      // Use regex for partial case-insensitive match on name
      const trainer = await User.findOne({ 
        name: { $regex: trainerUsername, $options: 'i' }, 
        role: 'trainer' 
      });
      if (trainer) {
        feedbackQuery = feedbackQuery.where('trainerId').equals(trainer._id);
      } else {
        return res.json([]); // Trainer not found, return empty
      }
    }

    if (searchType === 'customer' && customerUsername) {
      // Use regex for partial case-insensitive match on name
      const customer = await User.findOne({ 
        name: { $regex: customerUsername, $options: 'i' }, 
        role: 'customer' 
      });
      if (customer) {
        feedbackQuery = feedbackQuery.where('customerId').equals(customer._id);
      } else {
        return res.json([]); // Customer not found, return empty
      }
    }

    const feedback = await feedbackQuery
      .populate('trainerId', 'name')
      .populate('customerId', 'name');
    
    res.json(feedback);
  } catch (error) {
    console.error('Error searching feedback:', error);
    res.status(500).json({ message: 'Failed to search feedback' });
  }
};

module.exports = {
  getAllFeedback,
  deleteFeedback,
  searchFeedback
};
