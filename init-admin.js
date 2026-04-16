const mongoose = require('mongoose');
const Admin = require('./src/models/Admin');
require('dotenv').config();

const initializeAdmin = async () => {
  try {
    const mongoUri = process.env.MONGO_CLUSTER_URL || process.env.MONGO_CLUSTER_SRV_URL || 'mongodb://localhost:27017/portfolio';
    await mongoose.connect(mongoUri);

    let admin = await Admin.findOne({ username: 'NothingToSay..' });

    if (admin) {
      console.log('Admin user found, updating details...');
      admin.password = 'NothingToSay..IsThePassword..';
      admin.email = 'kaushal21092003kumar@gmail.com';
    } else {
      console.log('Creating new admin user...');
      admin = new Admin({
        username: 'NothingToSay..',
        password: 'NothingToSay..IsThePassword..',
        email: 'kaushal21092003kumar@gmail.com',
      });
    }

    await admin.save();
    console.log('✅ Admin user created successfully!');
    console.log('Username: NothingToSay..');
    console.log('Password: NothingToSay..IsThePassword..');
    console.log('⚠️  Please change your password immediately after first login!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing admin:', error.message);
    process.exit(1);
  }
};

initializeAdmin();
