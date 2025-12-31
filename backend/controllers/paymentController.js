const Payment = require('../models/Payment');
const User = require('../models/User');

// Controller to get all payments (with user data, filtering out deleted users)
const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate('userId', 'name email blocked');
    // Filter out payments where user has been deleted (userId is null)
    const validPayments = payments.filter(p => p.userId !== null);
    res.json(validPayments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ message: 'Failed to fetch payments' });
  }
};

// Controller to approve a payment
const approvePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findById(id);
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    if (payment.status !== 'pending') {
      return res.status(400).json({ message: 'Payment is not pending' });
    }
    
    // Update payment status
    payment.status = 'success';
    await payment.save();
    
    // Update user subscription status if applicable
    const user = await User.findById(payment.userId);
    if (user && user.subscription) {
      user.subscription.status = 'active';
      user.subscription.paymentId = payment._id;
      await user.save();
    }
    
    res.json({ 
      message: 'Payment approved successfully', 
      payment 
    });
  } catch (error) {
    console.error('Error approving payment:', error);
    res.status(500).json({ message: 'Failed to approve payment' });
  }
};

// Controller to reject a payment
const rejectPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findById(id);
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    if (payment.status !== 'pending') {
      return res.status(400).json({ message: 'Payment is not pending' });
    }
    
    // Update payment status
    payment.status = 'failed';
    await payment.save();
    
    // Update user subscription status to cancelled
    const user = await User.findById(payment.userId);
    if (user && user.subscription) {
      user.subscription.status = 'cancelled';
      await user.save();
    }
    
    res.json({ 
      message: 'Payment rejected successfully', 
      payment 
    });
  } catch (error) {
    console.error('Error rejecting payment:', error);
    res.status(500).json({ message: 'Failed to reject payment' });
  }
};

// Controller to delete a payment
const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findByIdAndDelete(id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.json({ message: 'Payment deleted successfully' });
  } catch (error) {
    console.error('Error deleting payment:', error);
    res.status(500).json({ message: 'Failed to delete payment' });
  }
};

module.exports = {
  getAllPayments,
  approvePayment,
  rejectPayment,
  deletePayment,
};