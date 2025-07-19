const express = require('express');
const router = express.Router();
const { auth, optionalAuth } = require('../middleware/auth');
const {
  getAllPosts,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
  getTrendingPosts,
  getSimilarPosts,
  getComments,
  searchPosts
} = require('../controllers/postController');

// Search posts (must come before parameterized routes)
router.get('/search', optionalAuth, searchPosts);

// Get trending posts
router.get('/trending', getTrendingPosts);

// Get all published posts with pagination and filtering
router.get('/', optionalAuth, getAllPosts);

// Test route to check if posts endpoint is working
router.get('/test', (req, res) => {
  res.json({ 
    message: 'Posts endpoint is working',
    auth: 'Middleware is working'
  });
});

// Get single post by slug
router.get('/:slug', optionalAuth, getPostBySlug);

// Create new post
router.post('/', auth, createPost);

// Update post
router.put('/:id', auth, updatePost);

// Delete post
router.delete('/:id', auth, deletePost);

// Like/Unlike post
router.post('/:id/like', auth, toggleLike);

// Get similar posts
router.get('/:id/similar', getSimilarPosts);

// Get comments for a post
router.get('/:id/comments', getComments);

module.exports = router; 