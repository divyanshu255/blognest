'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import Header from '@/components/Header';
import BlogCard from '@/components/BlogCard';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import { Post, Category } from '@/types';
import toast from 'react-hot-toast';

export default function Home() {
  const { user } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [trendingPosts, setTrendingPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [postsResponse, categoriesResponse, trendingResponse] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/posts?page=1&limit=6`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/categories`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/posts/trending`)
      ]);

      if (postsResponse.ok) {
        const postsData = await postsResponse.json();
        setPosts(postsData.posts);
        setHasMore(postsData.hasMore);
      }

      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData.categories || []);
      }

      if (trendingResponse.ok) {
        const trendingData = await trendingResponse.json();
        setTrendingPosts(trendingData.trendingPosts || []);
      }
    } catch (error) {
      console.error('Error fetching initial data:', error);
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = useCallback(async (categoryId: string, categorySlug: string) => {
    setSelectedCategory(categorySlug);
    setCurrentPage(1);
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/posts?page=1&limit=6${categorySlug ? `&category=${categorySlug}` : ''}`
      );
      
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts);
        setHasMore(data.hasMore);
      } else {
        toast.error('Failed to filter posts');
      }
    } catch (error) {
      console.error('Error filtering posts:', error);
      toast.error('Failed to filter posts');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMorePosts = async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    const nextPage = currentPage + 1;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/posts?page=${nextPage}&limit=6${selectedCategory ? `&category=${selectedCategory}` : ''}`
      );
      
      if (response.ok) {
        const data = await response.json();
        setPosts(prev => [...prev, ...data.posts]);
        setHasMore(data.hasMore);
        setCurrentPage(nextPage);
      } else {
        toast.error('Failed to load more posts');
      }
    } catch (error) {
      console.error('Error loading more posts:', error);
      toast.error('Failed to load more posts');
    } finally {
      setLoadingMore(false);
    }
  };

  const handlePostLike = useCallback((postId: string, newLikeState: boolean, newLikeCount: number) => {
    // Update posts array with new like state
    setPosts(prev => prev.map(post => 
      post._id === postId 
        ? { ...post, isLiked: newLikeState, likes: newLikeState ? [...post.likes, { user: 'user_2abc123def456', createdAt: new Date().toISOString() }] : post.likes.filter(like => like.user !== 'user_2abc123def456') }
        : post
    ));

    // Update trending posts array with new like state
    setTrendingPosts(prev => prev.map(post => 
      post._id === postId 
        ? { ...post, isLiked: newLikeState, likes: newLikeState ? [...post.likes, { user: 'user_2abc123def456', createdAt: new Date().toISOString() }] : post.likes.filter(like => like.user !== 'user_2abc123def456') }
        : post
    ));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white border border-gray-200 rounded-lg p-8 animate-pulse">
                    <div className="flex space-x-6">
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      </div>
                      <div className="w-64 h-64 bg-gray-200 rounded-lg"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-4 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {posts.map((post) => (
                <BlogCard 
                  key={post._id} 
                  post={post}
                />
              ))}
              
              {hasMore && (
                <div className="text-center pt-8">
                  <button
                    onClick={loadMorePosts}
                    disabled={loadingMore}
                    className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {loadingMore ? 'Loading...' : 'Load More Posts'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Sidebar
              categories={categories}
              trendingPosts={trendingPosts}
              selectedCategory={selectedCategory}
              onCategoryClick={handleCategoryClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
