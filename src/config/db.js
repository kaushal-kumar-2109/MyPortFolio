const mongoose = require('mongoose');
require('@dotenvx/dotenvx').config()

const mongoUri = process.env.MONGO_CLUSTER_URL || process.env.MONGO_CLUSTER_SRV_URL;

async function connectDatabase() {
  try {
    await mongoose.connect(mongoUri);
    console.log("✅ Successfully connected to MongoDB via Mongoose!");
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error.message);
    process.exit(1);
  }
}

module.exports = connectDatabase;
