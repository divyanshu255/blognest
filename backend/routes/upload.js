const express = require('express');
const multer = require('multer');
const { uploadImage } = require('../utils/cloudinary');
const auth = require('../middleware/auth');

const router = express.Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

// Upload image route (public for testing)
router.post('/image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    console.log('File received:', {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    });

    // Convert buffer to base64
    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    console.log('Uploading to Cloudinary...');
    
    // Upload to Cloudinary
    const result = await uploadImage(base64Image, 'blog-images');

    console.log('Upload successful:', result);

    res.json({
      message: 'Image uploaded successfully',
      imageUrl: result.url,
      publicId: result.public_id,
      width: result.width,
      height: result.height
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      message: 'Failed to upload image',
      error: error.message 
    });
  }
});

// Test route to check if upload endpoint is working
router.get('/test', (req, res) => {
  res.json({ 
    message: 'Upload endpoint is working',
    cloudinary: {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? 'Configured' : 'Not configured',
      api_key: process.env.CLOUDINARY_API_KEY ? 'Configured' : 'Not configured',
      api_secret: process.env.CLOUDINARY_API_SECRET ? 'Configured' : 'Not configured'
    }
  });
});

module.exports = router; 