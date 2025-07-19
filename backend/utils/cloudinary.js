const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload image to Cloudinary
const uploadImage = async (file, folder = 'blog-images') => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: folder,
      resource_type: 'auto',
      transformation: [
        { width: 1200, height: 800, crop: 'limit' },
        { quality: 'auto' }
      ]
    });

    return {
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image');
  }
};

// Delete image from Cloudinary
const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Failed to delete image');
  }
};

// Generate optimized image URL
const getOptimizedImageUrl = (url, options = {}) => {
  if (!url) return null;

  const { width = 800, height = 600, quality = 'auto', crop = 'limit' } = options;
  
  // If it's already a Cloudinary URL, transform it
  if (url.includes('cloudinary.com')) {
    return cloudinary.url(url, {
      transformation: [
        { width, height, crop },
        { quality }
      ]
    });
  }

  return url;
};

module.exports = {
  uploadImage,
  deleteImage,
  getOptimizedImageUrl
}; 