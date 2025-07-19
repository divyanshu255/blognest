const Category = require('../models/Category');
const Post = require('../models/Post');

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort({ name: 1 });

    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get category by slug with post count
const getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const category = await Category.findOne({ slug, isActive: true });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Get post count for this category
    const postCount = await Post.countDocuments({
      categories: category._id,
      status: 'published',
      isPublished: true
    });

    res.json({
      category: {
        ...category.toObject(),
        postCount
      }
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get posts by category
const getPostsByCategory = async (req, res) => {
  try {
    const { slug } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const category = await Category.findOne({ slug, isActive: true });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const posts = await Post.find({
      categories: category._id,
      status: 'published',
      isPublished: true
    })
      .populate('author', 'username firstName lastName profileImage')
      .populate('categories', 'name slug color')
      .sort({ publishedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Post.countDocuments({
      categories: category._id,
      status: 'published',
      isPublished: true
    });

    res.json({
      category,
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get category posts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get categories with post counts (for sidebar)
const getSidebarCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort({ name: 1 });

    // Get post count for each category
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        const postCount = await Post.countDocuments({
          categories: category._id,
          status: 'published',
          isPublished: true
        });

        return {
          ...category.toObject(),
          postCount
        };
      })
    );

    res.json({ categories: categoriesWithCounts });
  } catch (error) {
    console.error('Get sidebar categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllCategories,
  getCategoryBySlug,
  getPostsByCategory,
  getSidebarCategories
}; 