'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Save, Eye, Upload, X } from 'lucide-react';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import { Category } from '@/types';
import toast from 'react-hot-toast';

const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), {
  loading: () => <div className="h-96 bg-gray-100 rounded-lg animate-pulse" />,
  ssr: false
});

export default function WritePage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [featuredImage, setFeaturedImage] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/');
      return;
    }
    fetchCategories();
  }, [isLoaded, user, router]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/categories');
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      console.log('Uploading file:', file.name, file.size, file.type);
      
      const formData = new FormData();
      formData.append('image', file);

      console.log('Sending request to upload endpoint...');
      
      const response = await fetch('http://localhost:5000/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Upload successful:', data);
        toast.success('Image uploaded successfully!');
        return data.imageUrl;
      } else {
        const errorData = await response.json();
        console.error('Upload failed:', errorData);
        throw new Error(errorData.message || errorData.error || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload image');
      return null;
    }
  };

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error('Please fill in title and content');
      return;
    }

    if (selectedCategories.length === 0) {
      toast.error('Please select at least one category');
      return;
    }

    setIsPublishing(true);

    try {
      console.log('Publishing post with data:', {
        title,
        content: content.substring(0, 100) + '...',
        excerpt: excerpt || content.substring(0, 150) + '...',
        categories: selectedCategories,
        featuredImage,
        status: 'published',
      });

      const response = await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer dev_token',
        },
        body: JSON.stringify({
          title,
          content,
          excerpt: excerpt || content.substring(0, 150) + '...',
          categories: selectedCategories,
          featuredImage,
          status: 'published',
        }),
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Post published successfully:', data);
        toast.success('Post published successfully!');
        router.push('/');
      } else {
        const error = await response.json();
        console.error('Publish failed:', error);
        toast.error(error.message || 'Failed to publish post');
      }
    } catch (error) {
      console.error('Error publishing post:', error);
      toast.error('Failed to publish post. Please check your connection.');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleSaveDraft = async () => {
    setIsPublishing(true);

    try {
      const response = await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer dev_token',
        },
        body: JSON.stringify({
          title: title || 'Untitled',
          content,
          excerpt: excerpt || content.substring(0, 150) + '...',
          categories: selectedCategories,
          featuredImage,
          status: 'draft',
        }),
      });

      if (response.ok) {
        toast.success('Draft saved successfully!');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to save draft');
      }
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error('Failed to save draft');
    } finally {
      setIsPublishing(false);
    }
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  if (!isLoaded || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Write a story</h1>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsPreview(!isPreview)}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-100"
            >
              <Eye className="w-4 h-4" />
              <span className="text-sm font-medium">{isPreview ? 'Edit' : 'Preview'}</span>
            </button>
            <button
              onClick={handleSaveDraft}
              disabled={isPublishing}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 text-sm font-medium"
            >
              Save Draft
            </button>
            <button
              onClick={handlePublish}
              disabled={isPublishing}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 text-sm font-medium"
            >
              {isPublishing ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Editor */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              {/* Title Input */}
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-2xl font-bold text-gray-900 mb-6 border-none outline-none placeholder-gray-400"
              />

              {/* Featured Image Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Featured Image
                </label>
                {featuredImage ? (
                  <div className="relative">
                    <img
                      src={featuredImage}
                      alt="Featured"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => setFeaturedImage('')}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 mb-3">Click to upload featured image</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const imageUrl = await handleImageUpload(file);
                          if (imageUrl) {
                            setFeaturedImage(imageUrl);
                          }
                        }
                      }}
                      className="hidden"
                      id="featured-image"
                    />
                    <label
                      htmlFor="featured-image"
                      className="inline-block px-4 py-2 bg-black text-white rounded-lg cursor-pointer hover:bg-gray-800 transition-colors text-sm font-medium"
                    >
                      Choose Image
                    </label>
                  </div>
                )}
              </div>

              {/* Excerpt Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Excerpt (optional)
                </label>
                <textarea
                  placeholder="Write a brief description of your post..."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  rows={3}
                />
              </div>

              {/* Rich Text Editor */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Content
                </label>
                <RichTextEditor
                  content={content}
                  onChange={setContent}
                  onImageUpload={handleImageUpload}
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Categories
              </h3>
              <div className="space-y-3">
                {categories.map((category) => (
                  <label
                    key={category._id}
                    className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category._id)}
                      onChange={() => toggleCategory(category._id)}
                      className="rounded border-gray-300 text-black focus:ring-black"
                    />
                    <span className="text-sm text-gray-700 font-medium">{category.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 