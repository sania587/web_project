const express = require('express');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const router = express.Router();

// Import all user models
const User = require('../models/User');
const Trainer = require('../models/Trainer');
const Admin = require('../models/Admin');

// Email transporter configuration
// Set EMAIL_USER and EMAIL_PASS in your .env file
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Use Gmail App Password, not regular password
  },
});

// Helper function to find user across all models
const findUserByEmail = async (email) => {
  let user = await User.findOne({ email });
  if (user) return { user, model: User, role: 'customer' };

  user = await Trainer.findOne({ email });
  if (user) return { user, model: Trainer, role: 'trainer' };

  user = await Admin.findOne({ email });
  if (user) return { user, model: Admin, role: 'admin' };

  return null;
};

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send styled email with OTP
const sendOTPEmail = async (email, otp, userName) => {
  const mailOptions = {
    from: {
      name: 'FitHum',
      address: process.env.EMAIL_USER,
    },
    to: email,
    subject: '🔐 Password Reset OTP - FitHum',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 40px 0;">
              <table role="presentation" style="width: 600px; border-collapse: collapse; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.2);">
                <!-- Header -->
                <tr>
                  <td style="padding: 40px 40px 20px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700;">FitHum</h1>
                    <p style="color: rgba(255,255,255,0.8); margin: 10px 0 0; font-size: 14px;">Your Fitness Journey Starts Here</p>
                  </td>
                </tr>
                
                <!-- Content Box -->
                <tr>
                  <td style="padding: 0 40px 40px;">
                    <table role="presentation" style="width: 100%; background: white; border-radius: 16px; overflow: hidden;">
                      <tr>
                        <td style="padding: 40px; text-align: center;">
                          <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; margin: 0 auto 24px; display: flex; align-items: center; justify-content: center;">
                            <span style="font-size: 36px;">🔑</span>
                          </div>
                          
                          <h2 style="color: #1a202c; margin: 0 0 16px; font-size: 24px;">Password Reset Request</h2>
                          
                          <p style="color: #718096; margin: 0 0 32px; font-size: 15px; line-height: 1.6;">
                            Hi <strong>${userName || 'there'}</strong>,<br>
                            We received a request to reset your password. Use the OTP below to proceed:
                          </p>
                          
                          <!-- OTP Box -->
                          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 24px 40px; border-radius: 12px; margin-bottom: 24px;">
                            <p style="color: rgba(255,255,255,0.8); margin: 0 0 8px; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">Your OTP Code</p>
                            <p style="color: white; margin: 0; font-size: 40px; font-weight: 700; letter-spacing: 8px;">${otp}</p>
                          </div>
                          
                          <p style="color: #e53e3e; margin: 0 0 24px; font-size: 14px; font-weight: 500;">
                            ⏱️ This OTP expires in 10 minutes
                          </p>
                          
                          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
                          
                          <p style="color: #a0aec0; margin: 0; font-size: 13px; line-height: 1.6;">
                            If you didn't request this password reset, please ignore this email or contact support if you have concerns.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="padding: 0 40px 40px; text-align: center;">
                    <p style="color: rgba(255,255,255,0.6); margin: 0; font-size: 12px;">
                      © ${new Date().getFullYear()} FitHum. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  };

  return transporter.sendMail(mailOptions);
};

// ============================================
// POST /api/auth/forgot-password
// Send OTP to user's email
// ============================================
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    // Find user across all models
    const result = await findUserByEmail(email.toLowerCase());

    if (!result) {
      // Don't reveal if email exists for security
      return res.status(200).json({ 
        message: 'If an account with this email exists, an OTP has been sent.',
        success: true 
      });
    }

    const { user, model } = result;

    // Generate OTP
    const otp = generateOTP();

    // Hash OTP for secure storage
    const hashedOTP = await bcrypt.hash(otp, 10);

    // Set expiration (10 minutes from now)
    const expiration = new Date(Date.now() + 10 * 60 * 1000);

    // Update user with reset token
    await model.findByIdAndUpdate(user._id, {
      resetToken: hashedOTP,
      resetTokenExpiration: expiration,
    });

    // Send email
    await sendOTPEmail(email, otp, user.name);

    console.log(`OTP sent to ${email}`);

    res.status(200).json({
      message: 'OTP sent successfully! Please check your email.',
      success: true,
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
});

// ============================================
// POST /api/auth/verify-otp
// Verify the OTP entered by user
// ============================================
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }

  try {
    const result = await findUserByEmail(email.toLowerCase());

    if (!result) {
      return res.status(400).json({ message: 'Invalid email or OTP' });
    }

    const { user } = result;

    // Check if OTP exists
    if (!user.resetToken || !user.resetTokenExpiration) {
      return res.status(400).json({ message: 'No OTP request found. Please request a new one.' });
    }

    // Check if OTP expired
    if (new Date() > user.resetTokenExpiration) {
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    // Verify OTP
    const isValidOTP = await bcrypt.compare(otp, user.resetToken);

    if (!isValidOTP) {
      return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
    }

    res.status(200).json({
      message: 'OTP verified successfully!',
      success: true,
      verified: true,
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
});

// ============================================
// POST /api/auth/reset-password
// Reset password after OTP verification
// ============================================
router.post('/reset-password', async (req, res) => {
  const { email, newPassword, otp } = req.body;

  if (!email || !newPassword || !otp) {
    return res.status(400).json({ message: 'Email, OTP, and new password are required' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }

  try {
    const result = await findUserByEmail(email.toLowerCase());

    if (!result) {
      return res.status(400).json({ message: 'User not found' });
    }

    const { user, model } = result;

    // Verify OTP is still valid
    if (!user.resetToken || !user.resetTokenExpiration) {
      return res.status(400).json({ message: 'No valid OTP request found' });
    }

    if (new Date() > user.resetTokenExpiration) {
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    const isValidOTP = await bcrypt.compare(otp, user.resetToken);
    if (!isValidOTP) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear reset token
    await model.findByIdAndUpdate(user._id, {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiration: null,
    });

    console.log(`Password reset successful for ${email}`);

    res.status(200).json({
      message: 'Password reset successfully! You can now login with your new password.',
      success: true,
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
});

// ============================================
// GOOGLE AUTHENTICATION
// ============================================

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Helper to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Google Sign-In/Sign-Up endpoint
router.post('/google', async (req, res) => {
  try {
    const { credential, role } = req.body;
    
    if (!credential) {
      return res.status(400).json({ message: 'Google credential is required' });
    }

    // Decode the Google JWT token (it's a base64 encoded JWT)
    const tokenParts = credential.split('.');
    if (tokenParts.length !== 3) {
      return res.status(400).json({ message: 'Invalid Google credential' });
    }
    
    // Decode the payload (middle part)
    const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString('utf-8'));
    
    const { email, name, picture, sub: googleId } = payload;
    
    if (!email) {
      return res.status(400).json({ message: 'Email not provided by Google' });
    }

    // Check if user already exists in any model
    const existingResult = await findUserByEmail(email);
    
    if (existingResult) {
      // Existing user - just log them in
      const { user } = existingResult;
      
      // Check if blocked
      if (user.blocked) {
        return res.status(403).json({ 
          message: 'Your account has been blocked. Please contact support.' 
        });
      }
      
      // Update profile picture if not set
      if (!user.profilePicture && picture) {
        user.profilePicture = picture;
        await user.save();
      }
      
      const token = generateToken(user);
      
      // Determine dashboard URL
      let dashboardUrl = '/dashboard';
      if (user.role === 'admin') dashboardUrl = '/AdminDashboard';
      else if (user.role === 'trainer') dashboardUrl = '/trainer/dashboard';
      
      return res.status(200).json({
        message: 'Login successful',
        isNewUser: false,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profilePicture: user.profilePicture,
          profileDetails: user.profileDetails,
        },
        token,
        redirectUrl: dashboardUrl,
      });
    }
    
    // New user - create account with minimal info
    // Role defaults to 'customer' if not specified
    const userRole = role || 'customer';
    
    let newUser;
    const baseUserData = {
      name,
      email,
      password: await bcrypt.hash(googleId + Date.now().toString(), 10), // Random password for Google users
      profilePicture: picture || null,
    };
    
    if (userRole === 'trainer') {
      newUser = new Trainer({
        ...baseUserData,
        role: 'trainer',
        profileDetails: { gender: '', age: null },
      });
    } else {
      newUser = new User({
        ...baseUserData,
        role: 'customer',
        profileDetails: { gender: '', age: null },
      });
    }
    
    await newUser.save();
    const token = generateToken(newUser);
    
    // New users need to complete their profile
    return res.status(201).json({
      message: 'Account created successfully',
      isNewUser: true, // Frontend will redirect to complete profile
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        profilePicture: newUser.profilePicture,
      },
      token,
      redirectUrl: '/complete-profile', // Special route for new Google users
    });
    
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ message: 'Authentication failed. Please try again.' });
  }
});

module.exports = router;
