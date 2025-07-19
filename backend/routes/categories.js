const express = require('express');
const router = express.Router();
const {
  getAllCategories,
  getCategoryBySlug,
  getPostsByCategory,
  getSidebarCategories
} = require('../controllers/categoryController');

// Get all categories
router.get('/', getAllCategories);

// Get category by slug with post count
router.get('/:slug', getCategoryBySlug);

// Get posts by category
router.get('/:slug/posts', getPostsByCategory);

// Get categories with post counts (for sidebar)
router.get('/sidebar/categories', getSidebarCategories);

module.exports = router; 