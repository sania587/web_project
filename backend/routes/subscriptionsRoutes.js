const express = require('express');
const router = express.Router();
const SubscriptionController = require('../controllers/SubscriptionController');
const { protect, protectRole } = require('../middleware/authMiddleware');

// Get all subscriptions (public)
router.get('/subscriptions', SubscriptionController.getAllSubscriptions);

// Add a new subscription (admin)
router.post('/subscriptions', SubscriptionController.addSubscription);

// Update a subscription (admin)
router.put('/subscriptions/:id', SubscriptionController.updateSubscription);

// Delete a subscription by ID (admin)
router.delete('/subscriptions/:id', SubscriptionController.deleteSubscription);

// Purchase a subscription (customer - protected)
router.post('/purchase', protect, SubscriptionController.purchaseSubscription);

// Get my subscription status (customer - protected)
router.get('/my-subscription', protect, SubscriptionController.getMySubscription);

// Admin: Get pending payments for verification
router.get('/pending-payments', protect, SubscriptionController.getPendingPayments);

// Admin: Verify/Reject a payment
router.post('/verify-payment', protect, SubscriptionController.verifyPayment);

module.exports = router;
