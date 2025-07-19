'use client';

import { useState, useCallback, memo, useEffect } from 'react';
import { Heart, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/types';
import { useUser } from '@clerk/nextjs';
import toast from 'react-hot-toast';

interface BlogCardProps {
  post: Post;
}

const BlogCard = memo(function BlogCard({ post }: BlogCardProps) {
  const { user } = useUser();
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);

  // Update like state when post data changes
  useEffect(() => {
    setIsLiked(post.isLiked || false);
    setLikeCount(post.likes?.length || 0);
  }, [post.isLiked, post.likes]);

  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  }, []);

  const handleLike = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error('Please sign in to like posts');
      return;
    }

    // Optimistic update
    const newLikeState = !isLiked;
    const newLikeCount = newLikeState ? likeCount + 1 : likeCount - 1;
    
    setIsLiked(newLikeState);
    setLikeCount(newLikeCount);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/posts/${post._id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer dev_token',
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Update with server response to ensure consistency
        setIsLiked(data.isLiked);
        setLikeCount(data.likeCount);
        toast.success(data.isLiked ? 'Post liked!' : 'Post unliked!');
      } else {
        // Revert optimistic update on error
        setIsLiked(!newLikeState);
        setLikeCount(!newLikeState ? likeCount + 1 : likeCount - 1);
        toast.error('Failed to like post');
      }
    } catch (error) {
      // Revert optimistic update on error
      setIsLiked(!newLikeState);
      setLikeCount(!newLikeState ? likeCount + 1 : likeCount - 1);
      console.error('Error liking post:', error);
      toast.error('Failed to like post');
    }
  }, [post._id, user, isLiked, likeCount]);

  return (
    <Link href={`/blog/${post.slug}`} className="block">
      <article className="bg-white border border-gray-200 rounded-lg p-8 mb-6 hover:bg-gray-50 transition-colors shadow-sm cursor-pointer">
        <div className="flex items-start space-x-6">
          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Author and Date */}
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-sm text-gray-600 font-medium">
                {post.author.firstName} {post.author.lastName}
              </span>
              <span className="text-gray-400">•</span>
              <span className="text-sm text-gray-500">
                @ {formatDate(post.publishedAt)}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-900 mb-4 hover:text-gray-700 transition-colors line-clamp-2">
              {post.title}
            </h2>

            {/* Excerpt */}
            <p className="text-gray-600 mb-6 line-clamp-3 text-base leading-relaxed">
              {post.excerpt}
            </p>

            {/* Categories and Stats */}
            <div className="flex items-center space-x-4">
              {post.categories.slice(0, 1).map((category) => (
                <span
                  key={category._id}
                  className="px-4 py-2 bg-gray-100 text-gray-600 text-sm rounded-full font-medium"
                >
                  {category.name}
                </span>
              ))}
              <button
                onClick={handleLike}
                className={`flex items-center space-x-2 text-sm transition-colors ${
                  isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                <span className="font-medium">{likeCount}</span>
              </button>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <MessageCircle className="w-4 h-4" />
                <span>{post.commentCount || 0}</span>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="flex-shrink-0">
            {post.featuredImage ? (
              <div className="w-64 h-64 overflow-hidden rounded-lg">
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  width={256}
                  height={256}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                />
              </div>
            ) : (
              <div className="w-64 h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-400 text-sm">No image</span>
              </div>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
});

export default BlogCard; 