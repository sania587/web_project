const express = require('express');
const router = express.Router();
const sessionRequestController = require('../controllers/sessionRequestController');

// Create a session request (Customer -> Trainer)
router.post('/create', sessionRequestController.createSessionRequest);

// Get all session requests for a trainer
router.get('/trainer/:trainerId', sessionRequestController.getTrainerSessionRequests);

// Get all session requests for a customer
router.get('/customer/:customerId', sessionRequestController.getCustomerSessionRequests);

// Update session request (Accept/Reject/Schedule)
router.put('/:requestId', sessionRequestController.updateSessionRequest);

// Delete a session request
router.delete('/:requestId', sessionRequestController.deleteSessionRequest);

module.exports = router;
