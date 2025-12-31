const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');  // Assuming Admin schema is defined
const Trainer = require('../models/Trainer');  // Assuming Trainer schema is defined


// Environment variables (e.g., JWT secret)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Helper function to generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    JWT_SECRET,
    { expiresIn: '1d' }
  );
};

exports.signup = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      age,
      gender,
      healthGoals,
      specializations,
      certifications,
    } = req.body;

    // Validate input
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check if the email is already registered in any collection
    const existingUser = await User.findOne({ email });
    const existingAdmin = await Admin.findOne({ email });
    const existingTrainer = await Trainer.findOne({ email });

    if (existingUser || existingAdmin || existingTrainer) {
      return res.status(400).json({ message: 'Email is already in use.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the profileDetails object (this is the new part)
    const profileDetails = {
      age,
      gender,
      healthGoals,
      specializations,
      certifications,
    };

    // Create the user based on the role
    let user;

    if (role === 'admin') {
      user = new Admin({
        name,
        email,
        password: hashedPassword,
        role: 'admin',
      });
    } else if (role === 'trainer') {
      user = new Trainer({
        name,
        email,
        password: hashedPassword,
        role: 'trainer',
        profileDetails,  // Include profileDetails for Trainer
      });
    } else if (role === 'customer') {
      user = new User({
        name,
        email,
        password: hashedPassword,
        role: 'customer',
        profileDetails,  // Include profileDetails for Customer
      });
    } else {
      return res.status(400).json({ message: 'Invalid role.' });
    }

    await user.save();

    // Generate a token
    const token = generateToken(user);

    res.status(201).json({
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} registered successfully.`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileDetails: user.profileDetails,  // Return profile details
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};


// @desc User login
// @route POST /api/users/login
// @access Publi
// Login function to handle role-based redirection
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check if the user exists in Admin model
    let user = await Admin.findOne({ email });
    if (!user) {
      // If not found in Admin, check in Trainer model
      user = await Trainer.findOne({ email });
      if (!user) {
        // If not found in Trainer, check in User model (Customer)
        // Populate subscription.plan to get features
        user = await User.findOne({ email }).populate('subscription.plan');
        if (!user) {
          return res.status(404).json({ message: 'Invalid email or password.' });
        }
      }
    }

    // Check the password for the found user
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Check if the user is blocked
    if (user.blocked) {
      return res.status(403).json({ message: 'Your account has been blocked. Please contact support for assistance.' });
    }

    // Generate a token
    const token = generateToken(user);

    // Prepare the response based on the role
    let dashboardUrl = '/AdminDashboard';  // Default to generic dashboard
    if (user.role === 'admin') {
      dashboardUrl = '/AdminDashboard';  // Redirect to Admin Dashboard
    } else if (user.role === 'trainer') {
      dashboardUrl = '/trainer/dashboard';  // Redirect to Trainer Dashboard
    } else if (user.role === 'customer') {
      dashboardUrl = '/dashboard';  // Redirect to Customer Dashboard
    }

    // Build subscription info for customers
    let subscriptionInfo = null;
    if (user.role === 'customer' && user.subscription) {
      const isActive = user.subscription.status === 'active' && 
                       user.subscription.endDate && 
                       new Date(user.subscription.endDate) > new Date();
      
      subscriptionInfo = {
        status: isActive ? 'active' : (user.subscription.status || 'none'),
        plan: user.subscription.plan ? {
          id: user.subscription.plan._id,
          name: user.subscription.plan.name,
          features: user.subscription.plan.features || []
        } : null,
        startDate: user.subscription.startDate,
        endDate: user.subscription.endDate
      };
    }

    res.status(200).json({
      message: 'Login successful.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileDetails: user.profileDetails,
        subscription: subscriptionInfo
      },
      token,
      redirectUrl: dashboardUrl,
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// @desc Create a new payment
// @route POST /api/users/payment
// @access Private
exports.createPayment = async (req, res) => {
  try {
    const { userId, amount, paymentMethod, transactionId, status, type } = req.body;

    // Validate input
    if (!userId || !amount || !paymentMethod || !transactionId || !status || !type) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Create a new payment
    const payment = new Payment({
      userId,
      amount,
      paymentMethod,
      transactionId,
      status,
      type,
    });

    await payment.save();

    res.status(201).json({
      message: 'Payment created successfully.',
      payment: {
        id: payment._id,
        userId: payment.userId,
        amount: payment.amount,
        paymentMethod: payment.paymentMethod,
        transactionId: payment.transactionId,
        status: payment.status,
        type: payment.type,
        createdAt: payment.createdAt,
        updatedAt: payment.updatedAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// @desc Get user subscription details
// @route GET /api/users/subscription
// @access Public
exports.getSubscriptionDetails = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required.' });
    }

    const user = await User.findById(userId).populate('subscription');

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({
      message: 'Subscription details fetched successfully.',
      subscription: user.subscription,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// @desc Update user profile
// @route PUT /api/users/profile
// @access Private
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const { name, age, gender, healthGoals, specializations, certifications } = req.body;

    let Model;
    if (userRole === 'admin') {
      Model = Admin;
    } else if (userRole === 'trainer') {
      Model = Trainer;
    } else {
      Model = User;
    }

    const user = await Model.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Update basic fields
    if (name) user.name = name;

    // Update profile details based on role
    if (!user.profileDetails) {
      user.profileDetails = {};
    }
    
    if (age) user.profileDetails.age = age;
    if (gender) user.profileDetails.gender = gender;
    
    // Customer-specific
    if (userRole === 'customer' && healthGoals) {
      user.profileDetails.healthGoals = healthGoals;
    }
    
    // Trainer-specific
    if (userRole === 'trainer') {
      if (specializations) user.profileDetails.specializations = specializations;
      if (certifications) user.profileDetails.certifications = certifications;
    }

    await user.save();

    res.status(200).json({
      message: 'Profile updated successfully.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileDetails: user.profileDetails,
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// @desc Upload profile picture
// @route POST /api/users/profile/picture
// @access Private
exports.uploadProfilePicture = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    let Model;
    if (userRole === 'admin') {
      Model = Admin;
    } else if (userRole === 'trainer') {
      Model = Trainer;
    } else {
      Model = User;
    }

    const user = await Model.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Create the URL for the uploaded file
    const profilePictureUrl = `/uploads/profiles/${req.file.filename}`;
    user.profilePicture = profilePictureUrl;
    await user.save();

    res.status(200).json({
      message: 'Profile picture uploaded successfully.',
      profilePicture: profilePictureUrl
    });
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};
