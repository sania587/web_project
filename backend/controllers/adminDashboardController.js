const User = require('../models/User');
const Trainer = require('../models/Trainer');
const Feedback = require('../models/Feedback');
const Payment = require('../models/Payment');
const Session = require('../models/Session');
const Subscription = require('../models/Subscription');

// Get user count
const getUserCount = async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ userCount: count });
  } catch (error) {
    console.error('Error fetching user count:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get trainer count
const getTrainerCount = async (req, res) => {
  try {
    const count = await Trainer.countDocuments();
    res.json({ trainerCount: count });
  } catch (error) {
    console.error('Error fetching trainer count:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get feedback count
const getFeedbackCount = async (req, res) => {
  try {
    const count = await Feedback.countDocuments();
    res.json({ feedbackCount: count });
  } catch (error) {
    console.error('Error fetching feedback count:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all dashboard stats
const getAllStats = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const trainerCount = await Trainer.countDocuments();
    const feedbackCount = await Feedback.countDocuments();
    const sessionCount = await Session.countDocuments();
    const subscriptionCount = await Subscription.countDocuments();
    const paymentCount = await Payment.countDocuments();
    
    // Revenue Calculation
    const revenueResult = await Payment.aggregate([
      { $match: { status: { $ne: 'failed' } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // Recent Activity
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5);
    const recentPayments = await Payment.find().sort({ createdAt: -1 }).limit(5);

    const recentActivity = [
      ...recentUsers.map(u => ({
        type: 'signup',
        message: `New user joined: ${u.name}`,
        time: u.createdAt,
        id: u._id
      })),
      ...recentPayments.map(p => ({
        type: 'payment',
        message: `New payment received: $${p.amount}`,
        time: p.createdAt,
        id: p._id
      }))
    ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 10);

    res.json({
      activeUsers: userCount,
      activeTrainers: trainerCount,
      totalSessions: sessionCount,
      revenue: totalRevenue,
      feedbackCount,
      subscriptionCount,
      paymentCount,
      recentActivity
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Server error fetching stats' });
  }
};

module.exports = {
  getUserCount,
  getTrainerCount,
  getFeedbackCount,
  getAllStats
};