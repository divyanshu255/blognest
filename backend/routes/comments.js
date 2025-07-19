const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  createComment,
  getComments,
  updateComment,
  deleteComment
} = require('../controllers/commentController');

// Create a new comment
router.post('/', auth, createComment);

// Get comments for a post
router.get('/post/:postId', getComments);

// Update a comment
router.put('/:id', auth, updateComment);

// Delete a comment
router.delete('/:id', auth, deleteComment);

module.exports = router; 