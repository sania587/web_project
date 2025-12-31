const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const Admin = require('../models/Admin');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const createAdmin = async () => {
  try {
    // Connect to DB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB...');

    // Access details
    const email = 'admin@fithum.com';
    const password = 'admin123';
    
    // Check if admin exists
    const existingAdmin = await Admin.findOne({ email });
    
    if (existingAdmin) {
      console.log('Admin user already exists.');
      console.log(`Email: ${email}`);
      console.log('You can try logging in with the existing password.');
    } else {
      // Create new admin
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const admin = new Admin({
        name: 'Super Admin',
        email,
        password: hashedPassword,
        role: 'admin',
        gender: 'other',
        age: 30,
        profileDetails: {
          age: 30,
          gender: 'other'
        }
      });

      await admin.save();
      console.log('Admin user created successfully!');
      console.log('-----------------------------------');
      console.log(`Email: ${email}`);
      console.log(`Password: ${password}`);
      console.log('-----------------------------------');
    }

  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
};

createAdmin();
