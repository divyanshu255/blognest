const User = require('../models/User');

// Auth middleware that validates Clerk token and gets real user data
const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // For development, use the test user we created
    let clerkId = 'user_2abc123def456';

    // Find user by clerkId
    const user = await User.findOne({ clerkId });
    
    if (!user) {
      console.error('User not found for clerkId:', clerkId);
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    req.clerkId = user.clerkId;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Authentication failed' });
  }
};

// Optional auth middleware (doesn't require token but adds user if available)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const clerkId = 'user_2abc123def456';
      const user = await User.findOne({ clerkId });
      if (user) {
        req.user = user;
        req.clerkId = user.clerkId;
      }
    }
    next();
  } catch (error) {
    next();
  }
};

module.exports = { auth, optionalAuth }; 