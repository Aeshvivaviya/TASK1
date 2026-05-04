/**
 * MongoDB connection configuration
 */
const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('❌ MONGODB_URI is not set in .env file');
    console.error('👉 Set it to: mongodb://127.0.0.1:27017/career_portal');
    console.error('   OR use MongoDB Atlas free URI');
    process.exit(1);
  }

  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // fail fast — 5 sec timeout
      socketTimeoutMS: 45000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);

    if (error.message.includes('ECONNREFUSED')) {
      console.error('');
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error('  MongoDB is not running on your machine!');
      console.error('');
      console.error('  OPTION 1 — Use MongoDB Atlas (Free, Recommended):');
      console.error('  1. Go to https://www.mongodb.com/atlas');
      console.error('  2. Create free account + free M0 cluster');
      console.error('  3. Get connection URI and paste in backend/.env:');
      console.error('     MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/career_portal');
      console.error('');
      console.error('  OPTION 2 — Install MongoDB locally:');
      console.error('  https://www.mongodb.com/try/download/community');
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }

    process.exit(1);
  }
};

// Reconnect on disconnect
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected. Attempting reconnect...');
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB reconnected');
});

module.exports = connectDB;
