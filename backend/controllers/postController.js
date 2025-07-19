const Post = require('../models/Post');
const User = require('../models/User');
const Category = require('../models/Category');
const Comment = require('../models/Comment');

// Get all published posts with pagination and filtering
const getAllPosts = async (req, res) => {
  try {
    const { page = 1, limit = 6, category } = req.query;
    const skip = (page - 1) * limit;

    let query = { status: 'published', isPublished: true };

    if (category) {
      const categoryDoc = await Category.findOne({ slug: category });
      if (categoryDoc) {
        query.categories = categoryDoc._id;
      }
    }

    // For home page (no category), add some randomization
    let posts;
    if (!category) {
      // Get all posts and shuffle them
      const allPosts = await Post.find(query)
        .populate('author', 'username firstName lastName profileImage')
        .populate('categories', 'name slug color')
        .lean();
      
      // Shuffle posts and take the first 'limit' posts
      const shuffled = allPosts.sort(() => 0.5 - Math.random());
      posts = shuffled.slice(skip, skip + limit);
    } else {
      // For category pages, use normal sorting
      posts = await Post.find(query)
        .populate('author', 'username firstName lastName profileImage')
        .populate('categories', 'name slug color')
        .sort({ publishedAt: -1 })
        .limit(limit * 1)
        .skip(skip)
        .lean();
    }

    const total = await Post.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    // Add like status and comment count for authenticated users
    for (let post of posts) {
      if (req.user) {
        post.isLiked = post.likes.some(like => 
          like.user.toString() === req.user._id.toString()
        );
      }
      
      // Get comment count for each post
      const commentCount = await Comment.countDocuments({ 
        post: post._id, 
        isDeleted: { $ne: true } 
      });
      post.commentCount = commentCount;
    }

    res.json({
      posts,
      totalPages,
      currentPage: parseInt(page),
      total,
      hasMore: parseInt(page) < totalPages
    });
  } catch (error) {
    console.error('Get all posts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single post by slug
const getPostBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const post = await Post.findOne({ slug, status: 'published', isPublished: true })
      .populate('author', 'username firstName lastName profileImage')
      .populate('categories', 'name slug color')
      .lean();

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Add like status for authenticated users
    if (req.user) {
      post.isLiked = post.likes.some(like => 
        like.user.toString() === req.user._id.toString()
      );
    }

    // Get comment count
    const commentCount = await Comment.countDocuments({ 
      post: post._id, 
      isDeleted: { $ne: true } 
    });
    post.commentCount = commentCount;

    res.json({ post });
  } catch (error) {
    console.error('Get post by slug error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new post
const createPost = async (req, res) => {
  try {
    const { title, content, excerpt, featuredImage, categories, tags, status } = req.body;

    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    // Generate slug from title
    let slug = title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    // Check if slug already exists and make it unique
    let counter = 1;
    let originalSlug = slug;
    while (await Post.findOne({ slug })) {
      slug = `${originalSlug}-${counter}`;
      counter++;
    }

    // Check if title already exists for this user
    const existingPost = await Post.findOne({ title, author: req.user._id });
    if (existingPost) {
      return res.status(400).json({ message: 'A post with this title already exists' });
    }

    const post = new Post({
      title,
      slug,
      content,
      excerpt,
      featuredImage,
      author: req.user._id,
      categories: categories || [],
      tags: tags || [],
      status: status || 'draft'
    });

    await post.save();

    const populatedPost = await Post.findById(post._id)
      .populate('author', 'username firstName lastName profileImage')
      .populate('categories', 'name slug color');

    res.status(201).json({
      message: 'Post created successfully',
      post: populatedPost
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update post
const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, excerpt, featuredImage, categories, tags, status } = req.body;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user owns the post
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }

    const updates = {};
    if (title) updates.title = title;
    if (content) updates.content = content;
    if (excerpt !== undefined) updates.excerpt = excerpt;
    if (featuredImage !== undefined) updates.featuredImage = featuredImage;
    if (categories) updates.categories = categories;
    if (tags) updates.tags = tags;
    if (status) updates.status = status;

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    )
      .populate('author', 'username firstName lastName profileImage')
      .populate('categories', 'name slug color');

    res.json({
      message: 'Post updated successfully',
      post: updatedPost
    });
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete post
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user owns the post
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await Post.findByIdAndDelete(id);

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Like/Unlike post
const toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const likeIndex = post.likes.findIndex(like => 
      like.user.toString() === userId.toString()
    );

    let isLiked = false;
    if (likeIndex > -1) {
      // Unlike
      post.likes.splice(likeIndex, 1);
    } else {
      // Like
      post.likes.push({ user: userId, createdAt: new Date() });
      isLiked = true;
    }

    await post.save();

    res.json({ 
      message: isLiked ? 'Post liked' : 'Post unliked',
      isLiked,
      likeCount: post.likes.length
    });
  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get trending posts
const getTrendingPosts = async (req, res) => {
  try {
    const trendingPosts = await Post.find({ 
      status: 'published', 
      isPublished: true 
    })
      .populate('author', 'username firstName lastName profileImage')
      .populate('categories', 'name slug color')
      .populate('comments')
      .lean();

    // Sort by likes and comments count
    const sortedPosts = trendingPosts.sort((a, b) => {
      const aScore = (a.likes?.length || 0) + (a.comments?.length || 0);
      const bScore = (b.likes?.length || 0) + (b.comments?.length || 0);
      return bScore - aScore;
    }).slice(0, 4);

    res.json({ trendingPosts: sortedPosts });
  } catch (error) {
    console.error('Get trending posts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get similar posts
const getSimilarPosts = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const similarPosts = await Post.find({
      _id: { $ne: id },
      status: 'published',
      isPublished: true,
      $or: [
        { categories: { $in: post.categories } },
        { tags: { $in: post.tags } }
      ]
    })
      .populate('author', 'username firstName lastName profileImage')
      .populate('categories', 'name slug color')
      .sort({ publishedAt: -1 })
      .limit(3)
      .lean();

    res.json({ similarPosts });
  } catch (error) {
    console.error('Get similar posts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get comments for a post
const getComments = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comments = await Comment.find({ post: id })
      .populate('author', 'username firstName lastName profileImage')
      .sort({ createdAt: -1 })
      .lean();

    res.json({ comments });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Search posts
const searchPosts = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim() === '') {
      return res.json({ posts: [] });
    }

    const searchQuery = {
      $and: [
        { status: 'published', isPublished: true },
        {
          $or: [
            { title: { $regex: q, $options: 'i' } },
            { content: { $regex: q, $options: 'i' } },
            { excerpt: { $regex: q, $options: 'i' } }
          ]
        }
      ]
    };

    const posts = await Post.find(searchQuery)
      .populate('author', 'username firstName lastName profileImage')
      .populate('categories', 'name slug color')
      .sort({ publishedAt: -1 })
      .lean();

    // Add like status for authenticated users
    if (req.user) {
      posts.forEach(post => {
        post.isLiked = post.likes.some(like => 
          like.user.toString() === req.user._id.toString()
        );
      });
    }

    res.json({ posts });
  } catch (error) {
    console.error('Search posts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
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
}; 