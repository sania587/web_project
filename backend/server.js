// server.js

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const reportRoutes = require('./routes/reportRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');  // Correct import path for admin routes
const authRoutes = require('./routes/authRoutes');
const userManageRoutes = require('./routes/userManageRoutes');
const trainerManageRoutes = require('./routes/trainerManageRoutes');
const SubscriptionRoutes = require('./routes/subscriptionsRoutes'); // Correct import
const feedbackRoutes = require('./routes/feedbackRoutes');
const adminDashboardRoutes = require('./routes/adminDashboardRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes'); // New import for dashboard routes
const app = express();

dotenv.config();

// Middleware
app.use(cors());

app.use(express.json());
app.use(bodyParser.json());

// Serve static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.log('MongoDB connection error:', err));

// Define routes
app.use('/api/feedback', feedbackRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/counts', adminDashboardRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/admin', adminRoutes);  // Admin routes
app.use('/api/auth', authRoutes);  // Authentication routes
app.use('/api/users',userRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/managetrainers', trainerManageRoutes);
app.use('/api/Plan', SubscriptionRoutes);
app.use('/api/manageusers', userManageRoutes);

// Notification routes
const notificationRoutes = require('./routes/notificationRoutes');
const trainerRoutes = require('./routes/trainerRoutes');
const sessionRequestRoutes = require('./routes/sessionRequestRoutes');
const exerciseRoutes = require('./routes/exerciseRoutes'); // Import exercise routes
app.use('/api/notifications', notificationRoutes);
app.use('/api/trainer', trainerRoutes);
app.use('/api/session-requests', sessionRequestRoutes);
app.use('/api/exercises', exerciseRoutes); // Mount exercise routes

// Exercise Image Proxy - proxies images from RapidAPI to hide API key
const axios = require('axios');
app.get('/api/exercise-image/:id', async (req, res) => {
  try {
    const response = await axios.get(
      `https://exercisedb.p.rapidapi.com/images/${req.params.id}.gif`,
      {
        responseType: 'arraybuffer',
        headers: {
          'x-rapidapi-key': process.env.RAPID_API_KEY,
          'x-rapidapi-host': 'exercisedb.p.rapidapi.com'
        }
      }
    );

    res.set('Content-Type', 'image/gif');
    res.set('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
    res.send(response.data);
  } catch (error) {
    console.error('Exercise image proxy error:', error);
    res.status(500).send('Failed to fetch image');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
