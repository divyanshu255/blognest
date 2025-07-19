const User = require('../models/User');
const Post = require('../models/Post');

// Get user profile by username
const getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const user = await User.findOne({ username })
      .select('-__v')
      .populate('followers', 'username firstName lastName profileImage')
      .populate('following', 'username firstName lastName profileImage');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's published posts
    const posts = await Post.find({
      author: user._id,
      status: 'published',
      isPublished: true
    })
      .populate('categories', 'name slug color')
      .sort({ publishedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const totalPosts = await Post.countDocuments({
      author: user._id,
      status: 'published',
      isPublished: true
    });

    // Add like status for authenticated users
    if (req.user) {
      posts.forEach(post => {
        post.isLiked = post.likes.some(like => 
          like.user.toString() === req.user._id.toString()
        );
      });

      // Check if current user is following this user
      user.isFollowing = user.followers.some(follower => 
        follower._id.toString() === req.user._id.toString()
      );
    }

    res.json({
      user: {
        id: user._id,
        clerkId: user.clerkId,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImage: user.profileImage,
        bio: user.bio,
        isVerified: user.isVerified,
        fullName: user.fullName,
        followerCount: user.followerCount,
        followingCount: user.followingCount,
        followers: user.followers,
        following: user.following,
        createdAt: user.createdAt,
        isFollowing: user.isFollowing || false
      },
      posts,
      totalPages: Math.ceil(totalPosts / limit),
      currentPage: page,
      totalPosts
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Search users
const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim() === '') {
      return res.json({ users: [] });
    }

    const users = await User.find({
      $or: [
        { username: { $regex: q, $options: 'i' } },
        { firstName: { $regex: q, $options: 'i' } },
        { lastName: { $regex: q, $options: 'i' } }
      ]
    })
      .select('username firstName lastName profileImage')
      .sort({ username: 1 })
      .limit(10)
      .lean();

    res.json({ users });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user's followers
const getUserFollowers = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const user = await User.findById(userId)
      .populate({
        path: 'followers',
        select: 'username firstName lastName profileImage bio',
        options: {
          limit: limit * 1,
          skip: (page - 1) * limit,
          sort: { username: 1 }
        }
      });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const total = user.followers.length;

    res.json({
      followers: user.followers,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get followers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user's following
const getUserFollowing = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const user = await User.findById(userId)
      .populate({
        path: 'following',
        select: 'username firstName lastName profileImage bio',
        options: {
          limit: limit * 1,
          skip: (page - 1) * limit,
          sort: { username: 1 }
        }
      });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const total = user.following.length;

    res.json({
      following: user.following,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get following error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user's posts (for profile page)
const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10, status = 'published' } = req.query;

    const query = { author: userId };

    if (status === 'published') {
      query.status = 'published';
      query.isPublished = true;
    } else if (status === 'draft') {
      query.status = 'draft';
    }

    const posts = await Post.find(query)
      .populate('categories', 'name slug color')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Post.countDocuments(query);

    // Add like status for authenticated users
    if (req.user) {
      posts.forEach(post => {
        post.isLiked = post.likes.some(like => 
          like.user.toString() === req.user._id.toString()
        );
      });
    }

    res.json({
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get user posts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Toggle follow/unfollow user
const toggleFollow = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    if (currentUserId.toString() === userId) {
      return res.status(400).json({ message: 'Cannot follow yourself' });
    }

    const userToFollow = await User.findById(userId);
    const currentUser = await User.findById(currentUserId);

    if (!userToFollow || !currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isFollowing = currentUser.following.includes(userId);

    if (isFollowing) {
      // Unfollow
      await User.findByIdAndUpdate(currentUserId, {
        $pull: { following: userId },
        $inc: { followingCount: -1 }
      });
      await User.findByIdAndUpdate(userId, {
        $pull: { followers: currentUserId },
        $inc: { followerCount: -1 }
      });
    } else {
      // Follow
      await User.findByIdAndUpdate(currentUserId, {
        $addToSet: { following: userId },
        $inc: { followingCount: 1 }
      });
      await User.findByIdAndUpdate(userId, {
        $addToSet: { followers: currentUserId },
        $inc: { followerCount: 1 }
      });
    }

    res.json({ 
      message: isFollowing ? 'Unfollowed successfully' : 'Followed successfully',
      isFollowing: !isFollowing
    });
  } catch (error) {
    console.error('Toggle follow error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getUserProfile,
  searchUsers,
  getUserFollowers,
  getUserFollowing,
  getUserPosts,
  toggleFollow
}; 