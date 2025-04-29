require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function initAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const adminExists = await User.findOne({ username: process.env.ADMIN_USERNAME });
    
    if (adminExists) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    const admin = new User({
      username: process.env.ADMIN_USERNAME,
      password: process.env.ADMIN_PASSWORD,
      isAdmin: true,
    });

    await admin.save();
    console.log('Admin user created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

initAdmin(); 