const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smart_waste_db', {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`[MongoDB] Connected successfully to: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`[MongoDB Connection Warning] ${error.message}`);
    console.log(`[MongoDB Fallback] Operating in robust connection mode. Please ensure MongoDB service is started for full persistence.`);
    return false;
  }
};

module.exports = connectDB;
