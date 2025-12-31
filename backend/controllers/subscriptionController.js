const Subscription = require('../models/Subscription');
const User = require('../models/User');
const Payment = require('../models/Payment');

// Controller to get all subscriptions
const getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find();
    res.json(subscriptions);
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    res.status(500).json({ message: 'Failed to fetch subscriptions' });
  }
};

// Controller to add a new subscription
const addSubscription = async (req, res) => {
  try {
    const { name, duration, price, discount } = req.body;
    const newSubscription = new Subscription({ name, duration, price, discount });
    await newSubscription.save();
    res.status(201).json(newSubscription);
  } catch (error) {
    console.error('Error adding subscription:', error);
    res.status(500).json({ message: 'Failed to add subscription' });
  }
};

// Controller to delete a subscription
const deleteSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSubscription = await Subscription.findByIdAndDelete(id);
    if (!deletedSubscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }
    res.json({ message: 'Subscription deleted successfully' });
  } catch (error) {
    console.error('Error deleting subscription:', error);
    res.status(500).json({ message: 'Failed to delete subscription' });
  }
};

// Controller to purchase a subscription (for customers)
const purchaseSubscription = async (req, res) => {
  try {
    const userId = req.user.id;
    const { subscriptionId, paymentMethod, transactionId } = req.body;

    // Validate input
    if (!subscriptionId || !paymentMethod || !transactionId) {
      return res.status(400).json({ message: 'Subscription ID, payment method, and transaction ID are required.' });
    }

    // Find the subscription plan
    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription plan not found.' });
    }

    // Calculate end date based on duration
    const startDate = new Date();
    let endDate = new Date();
    switch (subscription.duration) {
      case 'monthly':
        endDate.setMonth(endDate.getMonth() + 1);
        break;
      case 'quarterly':
        endDate.setMonth(endDate.getMonth() + 3);
        break;
      case 'yearly':
        endDate.setFullYear(endDate.getFullYear() + 1);
        break;
      default:
        endDate.setMonth(endDate.getMonth() + 1);
    }

    // Calculate final price with discount
    const finalPrice = subscription.price - (subscription.price * (subscription.discount / 100));

    // Create payment record
    const payment = new Payment({
      userId,
      amount: finalPrice,
      paymentMethod,
      transactionId,
      status: 'pending', // Admin will verify and change to 'success'
      type: 'payment'
    });
    await payment.save();

    // Update user subscription - SET TO PENDING until admin verifies
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    user.subscription = {
      plan: subscription._id,
      startDate,
      endDate,
      status: 'pending', // Changed from 'active' - Admin must verify
      paymentId: payment._id
    };
    await user.save();

    res.status(201).json({
      message: 'Subscription request submitted! Your subscription will be activated once payment is verified.',
      subscription: {
        plan: subscription.name,
        duration: subscription.duration,
        startDate,
        endDate,
        amountPaid: finalPrice,
        status: 'pending'
      },
      paymentId: payment._id
    });
  } catch (error) {
    console.error('Error purchasing subscription:', error);
    res.status(500).json({ message: 'Failed to purchase subscription', error: error.message });
  }
};

// Controller to get user's subscription status
const getMySubscription = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate('subscription.plan');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json({
      subscription: user.subscription || { status: 'none' }
    });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    res.status(500).json({ message: 'Failed to fetch subscription status' });
  }
};

// Admin: Get all pending payments for verification
const getPendingPayments = async (req, res) => {
  try {
    const pendingPayments = await Payment.find({ status: 'pending' })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(pendingPayments);
  } catch (error) {
    console.error('Error fetching pending payments:', error);
    res.status(500).json({ message: 'Failed to fetch pending payments' });
  }
};

// Admin: Verify/Approve a payment
const verifyPayment = async (req, res) => {
  try {
    const { paymentId, action } = req.body; // action: 'approve' or 'reject'
    
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found.' });
    }

    const user = await User.findById(payment.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (action === 'approve') {
      // Approve payment
      payment.status = 'success';
      await payment.save();

      // Activate user subscription
      if (user.subscription && user.subscription.status === 'pending') {
        user.subscription.status = 'active';
        await user.save();
      }

      res.json({ message: 'Payment approved! User subscription activated.' });
    } else if (action === 'reject') {
      // Reject payment
      payment.status = 'failed';
      await payment.save();

      // Cancel user subscription
      if (user.subscription && user.subscription.status === 'pending') {
        user.subscription.status = 'cancelled';
        await user.save();
      }

      res.json({ message: 'Payment rejected. User subscription cancelled.' });
    } else {
      res.status(400).json({ message: 'Invalid action. Use "approve" or "reject".' });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ message: 'Failed to verify payment' });
  }
};

// Update subscription (for adding features etc.)
const updateSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, duration, price, discount, features, description } = req.body;
    
    const subscription = await Subscription.findByIdAndUpdate(
      id,
      { name, duration, price, discount, features, description },
      { new: true }
    );
    
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }
    
    res.json(subscription);
  } catch (error) {
    console.error('Error updating subscription:', error);
    res.status(500).json({ message: 'Failed to update subscription' });
  }
};

module.exports = {
  getAllSubscriptions,
  addSubscription,
  deleteSubscription,
  purchaseSubscription,
  getMySubscription,
  getPendingPayments,
  verifyPayment,
  updateSubscription,
};
