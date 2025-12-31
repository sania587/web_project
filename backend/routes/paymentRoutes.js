const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Route to get all payments
router.get('/', paymentController.getAllPayments);

// Route to approve a payment
router.put('/approve/:id', paymentController.approvePayment);

// Route to reject a payment
router.put('/reject/:id', paymentController.rejectPayment);

// Route to delete a payment
router.delete('/:id', paymentController.deletePayment);

module.exports = router;
