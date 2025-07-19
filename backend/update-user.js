const mongoose = require('mongoose');
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/blognest', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function updateUser() {
  try {
    // Find the user with the specific clerkId
    const user = await User.findOne({ clerkId: 'user_2abc123def456' });
    
    if (user) {
      console.log('Current user data:', user);
      
      // Update the user with correct information
      user.firstName = 'Divyanshu';
      user.lastName = 'Patel';
      user.username = 'divyanshupatel';
      user.profileImage = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face';
      
      await user.save();
      console.log('User updated successfully:', user);
    } else {
      console.log('User not found, creating new user...');
      
      // Create a new user with correct information
      const newUser = new User({
        clerkId: 'user_2abc123def456',
        username: 'divyanshupatel',
        firstName: 'Divyanshu',
        lastName: 'Patel',
        email: 'divyanshu@example.com',
        profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        bio: 'Full-stack developer passionate about creating amazing web experiences.',
        isVerified: true
      });
      
      await newUser.save();
      console.log('New user created successfully:', newUser);
    }
  } catch (error) {
    console.error('Error updating user:', error);
  } finally {
    mongoose.connection.close();
  }
}

updateUser(); 