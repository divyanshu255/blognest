const mongoose = require('mongoose');
const Category = require('../models/Category');
require('dotenv').config();

const categories = [
  {
    name: 'Programming',
    slug: 'programming',
    description: 'Software development, coding tutorials, and tech insights',
    color: '#3B82F6'
  },
  {
    name: 'Travel',
    slug: 'travel',
    description: 'Travel experiences, destinations, and adventure stories',
    color: '#10B981'
  },
  {
    name: 'Food',
    slug: 'food',
    description: 'Culinary adventures, recipes, and food culture',
    color: '#F59E0B'
  },
  {
    name: 'Technology',
    slug: 'technology',
    description: 'Latest tech trends, gadgets, and innovations',
    color: '#8B5CF6'
  },
  {
    name: 'Lifestyle',
    slug: 'lifestyle',
    description: 'Personal development, wellness, and daily life',
    color: '#EC4899'
  },
  {
    name: 'Business',
    slug: 'business',
    description: 'Entrepreneurship, startups, and business insights',
    color: '#6366F1'
  },
  {
    name: 'Health',
    slug: 'health',
    description: 'Physical and mental health, fitness, and wellness',
    color: '#EF4444'
  },
  {
    name: 'Education',
    slug: 'education',
    description: 'Learning resources, tutorials, and educational content',
    color: '#06B6D4'
  },
  {
    name: 'Entertainment',
    slug: 'entertainment',
    description: 'Movies, music, books, and entertainment reviews',
    color: '#84CC16'
  },
  {
    name: 'Finance',
    slug: 'finance',
    description: 'Personal finance, investing, and money management',
    color: '#F97316'
  }
];

const seedCategories = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing categories
    await Category.deleteMany({});
    console.log('Cleared existing categories');

    // Insert new categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`Created ${createdCategories.length} categories:`);
    
    createdCategories.forEach(category => {
      console.log(`- ${category.name} (${category.slug})`);
    });

    console.log('Categories seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding categories:', error);
    process.exit(1);
  }
};

// Run the seed function
seedCategories(); 