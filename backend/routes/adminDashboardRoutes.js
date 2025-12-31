// routes/adminDashboardRoutes.js
const express = require("express");
const {
  getUserCount,
  getTrainerCount,
  getFeedbackCount,
  getAllStats,
} = require("../controllers/adminDashboardController");
const router = express.Router();

// Define routes
router.get("/user-count", getUserCount);
router.get("/trainer-count", getTrainerCount);
router.get("/feedback-count", getFeedbackCount);
router.get("/stats", getAllStats);

module.exports = router;