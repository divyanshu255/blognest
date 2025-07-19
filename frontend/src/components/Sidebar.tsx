'use client';

import { TrendingUp } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Category, Post } from '@/types';

interface SidebarProps {
  categories: Category[];
  trendingPosts: Post[];
  selectedCategory: string;
  onCategoryClick: (categoryId: string, categorySlug: string) => void;
}

export default function Sidebar({ categories, trendingPosts, selectedCategory, onCategoryClick }: SidebarProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-8">
      {/* Categories */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
        <div className="space-y-2">
          {Array.isArray(categories) && categories.map((category) => (
            <button
              key={category._id}
              onClick={() => onCategoryClick(category._id, category.slug)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category.slug
                  ? 'bg-black text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Trending Posts */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <TrendingUp className="w-5 h-5" />
          <span>Trending</span>
        </h3>
        <div className="space-y-4">
          {trendingPosts.map((post) => (
            <Link
              key={post._id}
              href={`/blog/${post.slug}`}
              className="block group hover:bg-gray-50 rounded-lg p-3 transition-colors"
            >
              <div className="flex space-x-3">
                {/* Post Image */}
                <div className="flex-shrink-0">
                  {post.featuredImage ? (
                    <div className="w-16 h-16 overflow-hidden rounded-lg">
                      <Image
                        src={post.featuredImage}
                        alt={post.title}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400 text-xs">No image</span>
                    </div>
                  )}
                </div>

                {/* Post Content */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 group-hover:text-gray-700 line-clamp-2 mb-1">
                    {post.title}
                  </h4>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <span>{post.author.firstName} {post.author.lastName}</span>
                    <span>•</span>
                    <span>{formatDate(post.publishedAt)}</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-gray-500">
                      {post.likes?.length || 0} likes
                    </span>
                    {post.categories.length > 0 && (
                      <>
                        <span className="text-gray-300">•</span>
                        <span className="text-xs text-gray-500">
                          {post.categories[0].name}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 