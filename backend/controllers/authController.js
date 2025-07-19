const User = require('../models/User');

// Register new user (called when user signs up with Clerk)
const registerUser = async (req, res) => {
  try {
    const { clerkId, email, username, firstName, lastName, profileImage } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ clerkId }, { email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = new User({
      clerkId,
      email,
      username,
      firstName,
      lastName,
      profileImage: profileImage || ''
    });

    await user.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        clerkId: user.clerkId,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImage: user.profileImage,
        fullName: user.fullName
      }
    });
  } catch (error) {
    console.error('Register user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get current user profile
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-__v');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
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
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { username, firstName, lastName, bio, profileImage } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if username is already taken by another user
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already taken' });
      }
    }

    const updates = {};
    if (username) updates.username = username;
    if (firstName) updates.firstName = firstName;
    if (lastName) updates.lastName = lastName;
    if (bio !== undefined) updates.bio = bio;
    if (profileImage !== undefined) updates.profileImage = profileImage;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-__v');

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        clerkId: updatedUser.clerkId,
        email: updatedUser.email,
        username: updatedUser.username,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        profileImage: updatedUser.profileImage,
        bio: updatedUser.bio,
        isVerified: updatedUser.isVerified,
        fullName: updatedUser.fullName,
        followerCount: updatedUser.followerCount,
        followingCount: updatedUser.followingCount,
        createdAt: updatedUser.createdAt
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Follow/Unfollow user
const toggleFollow = async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.user._id.toString() === userId) {
      return res.status(400).json({ message: 'Cannot follow yourself' });
    }

    const userToFollow = await User.findById(userId);
    if (!userToFollow) {
      return res.status(404).json({ message: 'User not found' });
    }

    const currentUser = await User.findById(req.user._id);

    const isFollowing = currentUser.following.includes(userId);

    if (isFollowing) {
      // Unfollow
      currentUser.following = currentUser.following.filter(id => id.toString() !== userId);
      userToFollow.followers = userToFollow.followers.filter(id => id.toString() !== req.user._id.toString());
    } else {
      // Follow
      currentUser.following.push(userId);
      userToFollow.followers.push(req.user._id);
    }

    await Promise.all([currentUser.save(), userToFollow.save()]);

    res.json({
      message: isFollowing ? 'User unfollowed' : 'User followed',
      isFollowing: !isFollowing
    });
  } catch (error) {
    console.error('Toggle follow error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Clerk webhook handler for user events
const handleClerkWebhook = async (req, res) => {
  try {
    const { type, data } = req.body;

    switch (type) {
      case 'user.created':
        // Create user in our database
        const { id, email_addresses, username, first_name, last_name, image_url } = data;

        const existingUser = await User.findOne({ clerkId: id });
        if (!existingUser) {
          const user = new User({
            clerkId: id,
            email: email_addresses[0]?.email_address || '',
            username: username || first_name?.toLowerCase() || 'user',
            firstName: first_name || '',
            lastName: last_name || '',
            profileImage: image_url || ''
          });
          await user.save();
        }
        break;

      case 'user.updated':
        // Update user in our database
        const { id: userId, email_addresses: emails, username: newUsername, first_name: newFirstName, last_name: newLastName, image_url: newImageUrl } = data;

        await User.findOneAndUpdate(
          { clerkId: userId },
          {
            email: emails[0]?.email_address || '',
            username: newUsername || newFirstName?.toLowerCase() || 'user',
            firstName: newFirstName || '',
            lastName: newLastName || '',
            profileImage: newImageUrl || ''
          }
        );
        break;

      case 'user.deleted':
        // Delete user from our database
        await User.findOneAndDelete({ clerkId: data.id });
        break;
    }

    res.json({ message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('Clerk webhook error:', error);
    res.status(500).json({ message: 'Webhook processing failed' });
  }
};

module.exports = {
  registerUser,
  getCurrentUser,
  updateProfile,
  toggleFollow,
  handleClerkWebhook
}; 