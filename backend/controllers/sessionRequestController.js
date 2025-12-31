const SessionRequest = require('../models/SessionRequest');
const User = require('../models/User');
const Trainer = require('../models/Trainer');

// Create a new session request (Customer -> Trainer)
const createSessionRequest = async (req, res) => {
  try {
    const { trainerId, message, preferredDate, preferredTime } = req.body;
    const customerId = req.body.customerId;

    // Verify customer exists
    const customer = await User.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Verify trainer exists
    const trainer = await Trainer.findById(trainerId);
    if (!trainer) {
      return res.status(404).json({ message: 'Trainer not found' });
    }

    // Create session request
    const sessionRequest = new SessionRequest({
      customer: customerId,
      trainer: trainerId,
      message,
      preferredDate,
      preferredTime,
      status: 'pending'
    });

    await sessionRequest.save();

    // Add notification to trainer
    trainer.notifications.push(`📅 New session request from ${customer.name}`);
    await trainer.save();

    res.status(201).json({
      message: 'Session request sent successfully',
      sessionRequest
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating session request', error: error.message });
  }
};

// Get all session requests for a trainer
const getTrainerSessionRequests = async (req, res) => {
  try {
    const { trainerId } = req.params;
    
    const requests = await SessionRequest.find({ trainer: trainerId })
      .populate('customer', 'name email profilePicture')
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching session requests', error: error.message });
  }
};

// Get all session requests for a customer
const getCustomerSessionRequests = async (req, res) => {
  try {
    const { customerId } = req.params;
    
    const requests = await SessionRequest.find({ customer: customerId })
      .populate('trainer', 'name email profilePicture specialization')
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching session requests', error: error.message });
  }
};

// Update session request status (Accept/Reject/Schedule)
const updateSessionRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status, trainerResponse, scheduledDate, scheduledTime } = req.body;

    const sessionRequest = await SessionRequest.findById(requestId)
      .populate('customer', 'name notifications')
      .populate('trainer', 'name');

    if (!sessionRequest) {
      return res.status(404).json({ message: 'Session request not found' });
    }

    // Update the request
    sessionRequest.status = status;
    if (trainerResponse) sessionRequest.trainerResponse = trainerResponse;
    if (scheduledDate) sessionRequest.scheduledDate = scheduledDate;
    if (scheduledTime) sessionRequest.scheduledTime = scheduledTime;

    await sessionRequest.save();

    // Notify customer based on status
    const customer = await User.findById(sessionRequest.customer._id);
    if (customer) {
      let notificationMessage = '';
      if (status === 'accepted') {
        notificationMessage = `✅ ${sessionRequest.trainer.name} accepted your session request!`;
      } else if (status === 'rejected') {
        notificationMessage = `❌ ${sessionRequest.trainer.name} declined your session request.`;
      } else if (status === 'scheduled') {
        notificationMessage = `📅 ${sessionRequest.trainer.name} scheduled your session for ${scheduledDate} at ${scheduledTime}`;
      }
      
      if (notificationMessage) {
        customer.notifications.push(notificationMessage);
        await customer.save();
      }
    }

    res.status(200).json({
      message: 'Session request updated successfully',
      sessionRequest
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating session request', error: error.message });
  }
};

// Delete a session request
const deleteSessionRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    await SessionRequest.findByIdAndDelete(requestId);
    res.status(200).json({ message: 'Session request deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting session request', error: error.message });
  }
};

module.exports = {
  createSessionRequest,
  getTrainerSessionRequests,
  getCustomerSessionRequests,
  updateSessionRequest,
  deleteSessionRequest
};
