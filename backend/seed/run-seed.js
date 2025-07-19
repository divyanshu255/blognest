const mongoose = require('mongoose');
require('dotenv').config();

const { seedPosts } = require('./posts');

async function runSeed() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/blognest');
    console.log('✅ Connected to MongoDB');
    
    await seedPosts();
    
    console.log('🎉 All seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

runSeed(); 