const express = require('express');
const router = express.Router();
const { auth, optionalAuth } = require('../middleware/auth');
const {
  getUserProfile,
  searchUsers,
  getUserFollowers,
  getUserFollowing,
  getUserPosts,
  toggleFollow
} = require('../controllers/userController');

// Search users (must come before parameterized routes)
router.get('/search', optionalAuth, searchUsers);

// Get user profile by username
router.get('/profile/:username', optionalAuth, getUserProfile);

// Get user's followers
router.get('/:userId/followers', optionalAuth, getUserFollowers);

// Get user's following
router.get('/:userId/following', optionalAuth, getUserFollowing);

// Get user's posts
router.get('/:userId/posts', optionalAuth, getUserPosts);

// Follow/Unfollow user
router.post('/:userId/follow', auth, toggleFollow);

module.exports = router; 