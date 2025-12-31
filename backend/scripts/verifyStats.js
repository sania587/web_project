const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');
const Trainer = require('../models/Trainer');
const Feedback = require('../models/Feedback');
const Payment = require('../models/Payment');
const Session = require('../models/Session');
const Subscription = require('../models/Subscription');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const verifyStats = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB...');

        const userCount = await User.countDocuments();
        const trainerCount = await Trainer.countDocuments();
        const feedbackCount = await Feedback.countDocuments();
        const sessionCount = await Session.countDocuments();
        const subscriptionCount = await Subscription.countDocuments();
        const paymentCount = await Payment.countDocuments();

        const payments = await Payment.find();
        const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

        console.log('--- DB Verification Stats ---');
        console.log(`Users: ${userCount}`);
        console.log(`Trainers: ${trainerCount}`);
        console.log(`Sessions: ${sessionCount}`);
        console.log(`Revenue: ${totalRevenue}`);
        console.log(`Subscriptions: ${subscriptionCount}`);
        console.log(`Payments: ${paymentCount}`);
        console.log('-----------------------------');

    } catch (error) {
        console.error('Error verifying stats:', error);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
};

verifyStats();
