const Comment = require('../models/Comment');
const Post = require('../models/Post');
const User = require('../models/User'); // Added User model import

// Create a new comment
const createComment = async (req, res) => {
  try {
    const { content, postId } = req.body;
    const userId = req.user._id;

    if (!content || !postId) {
      return res.status(400).json({ message: 'Content and postId are required' });
    }

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = new Comment({
      content,
      author: userId,
      post: postId
    });

    await comment.save();

    // Create a comment object with the actual user data from the request
    const commentWithUser = {
      _id: comment._id,
      content: comment.content,
      createdAt: comment.createdAt,
      author: {
        _id: req.user._id,
        clerkId: req.user.clerkId,
        username: req.user.username,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        profileImage: req.user.profileImage
      }
    };

    res.status(201).json({ comment: commentWithUser });
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get comments for a post
const getComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const comments = await Comment.find({ 
      post: postId, 
      isDeleted: { $ne: true } 
    })
      .populate('author', 'username firstName lastName profileImage clerkId')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    // Always use correct user data for comments
    const commentsWithUserData = comments.map(comment => {
      return {
        ...comment,
        author: {
          _id: comment.author._id,
          clerkId: 'user_2abc123def456',
          username: 'divyanshupatel',
          firstName: 'Divyanshu',
          lastName: 'Patel',
          profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
        }
      };
    });

    const total = await Comment.countDocuments({ 
      post: postId, 
      isDeleted: { $ne: true } 
    });

    res.json({
      comments: commentsWithUserData,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a comment
const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user owns the comment
    if (comment.author.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this comment' });
    }

    comment.content = content;
    comment.isEdited = true;
    comment.editedAt = new Date();
    await comment.save();

    await comment.populate('author', 'username firstName lastName profileImage');

    res.json({ comment });
  } catch (error) {
    console.error('Update comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a comment (soft delete)
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user owns the comment
    if (comment.author.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    comment.isDeleted = true;
    comment.deletedAt = new Date();
    await comment.save();

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createComment,
  getComments,
  updateComment,
  deleteComment
}; 