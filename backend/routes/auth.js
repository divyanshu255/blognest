const express = require('express');
const router = express.Router();
const { auth, optionalAuth } = require('../middleware/auth');
const {
  registerUser,
  getCurrentUser,
  updateProfile,
  toggleFollow,
  handleClerkWebhook
} = require('../controllers/authController');

// Register new user (called when user signs up with Clerk)
router.post('/register', registerUser);

// Get current user profile
router.get('/me', auth, getCurrentUser);

// Update user profile
router.put('/profile', auth, updateProfile);

// Follow/Unfollow user
router.post('/follow/:userId', auth, toggleFollow);

// Clerk webhook handler
router.post('/webhook', handleClerkWebhook);

// Development route to create a test user with real data
router.post('/create-test-user', async (req, res) => {
  try {
    const User = require('../models/User');
    
    // Check if test user already exists
    let testUser = await User.findOne({ clerkId: 'user_2abc123def456' });
    
    if (!testUser) {
      testUser = new User({
        clerkId: 'user_2abc123def456',
        email: 'divyanshupatel01234@gmail.com',
        username: 'divyanshu',
        firstName: 'Divyanshu',
        lastName: 'Patel',
        profileImage: 'https://images.clerk.dev/eyJ0eXBlIjoicHVibGljIiwiaWQiOiJpbWdfMkFiYzEyM2RlZjQ1NiIsInByb3ZpZGVyIjoiZ29vZ2xlIiwicHJvdmlkZXJJZCI6IjExNzQ5NzQ5NzQ5NzQ5NzQ5NzQ5IiwicmVwb3NpdG9yeSI6ImNsZXJrLXVzZXJzIiwic2l6ZSI6MzAwLCJ3aWR0aCI6MzAwLCJoZWlnaHQiOjMwMCwiZm9jdXNfeCI6MTUwLCJmb2N1c195IjoxNTB9'
      });
      await testUser.save();
    }
    
    res.json({
      message: 'Test user created successfully',
      user: {
        id: testUser._id,
        clerkId: testUser.clerkId,
        email: testUser.email,
        username: testUser.username,
        firstName: testUser.firstName,
        lastName: testUser.lastName,
        profileImage: testUser.profileImage,
        fullName: testUser.fullName
      }
    });
  } catch (error) {
    console.error('Create test user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 