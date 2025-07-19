'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import { Search, PenTool } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<{ posts: any[], users: any[] }>({ posts: [], users: [] });
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
    }
  }, [searchQuery, router]);

  const handleWriteClick = useCallback(() => {
    if (user) {
      router.push('/write');
    } else {
      const signInButton = document.querySelector('[data-clerk-sign-in]');
      if (signInButton) {
        (signInButton as HTMLElement).click();
      }
    }
  }, [user, router]);

  const prefetchWritePage = useCallback(() => {
    if (user) {
      router.prefetch('/write');
    }
  }, [user, router]);

  const searchPosts = async (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/posts/search?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.posts?.slice(0, 5) || []);
      }
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length > 2) {
        try {
          const [postsResponse, usersResponse] = await Promise.all([
            fetch(`http://localhost:5000/api/posts/search?q=${encodeURIComponent(searchQuery)}&limit=3`),
            fetch(`http://localhost:5000/api/users/search?q=${encodeURIComponent(searchQuery)}&limit=3`)
          ]);

          if (postsResponse.ok && usersResponse.ok) {
            const postsData = await postsResponse.json();
            const usersData = await usersResponse.json();

            setSuggestions({
              posts: postsData.posts || [],
              users: usersData.users || []
            });
            setShowSuggestions(true);
          } else {
            setSuggestions({ posts: [], users: [] });
            setShowSuggestions(false);
          }
        } catch (error) {
          setSuggestions({ posts: [], users: [] });
          setShowSuggestions(false);
        }
      } else {
        setSuggestions({ posts: [], users: [] });
        setShowSuggestions(false);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity cursor-pointer">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">B</span>
            </div>
            <span className="text-xl font-bold text-gray-900">BlogNest</span>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8 relative">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                />
              </div>
            </form>

            {/* Search Suggestions */}
            {showSuggestions && (suggestions.posts.length > 0 || suggestions.users.length > 0) && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                {suggestions.posts.length > 0 && (
                  <div className="p-3 border-b border-gray-100">
                    <div className="text-xs font-medium text-gray-500 mb-2">Posts</div>
                    {suggestions.posts.map((post) => (
                      <Link
                        key={post._id}
                        href={`/blog/${post.slug}`}
                        className="block p-2 hover:bg-gray-50 rounded text-sm"
                        onClick={() => setShowSuggestions(false)}
                      >
                        <div className="font-medium text-gray-900">{post.title}</div>
                        <div className="text-gray-500 text-xs">{post.author.firstName} {post.author.lastName}</div>
                      </Link>
                    ))}
                  </div>
                )}
                {suggestions.users.length > 0 && (
                  <div className="p-3">
                    <div className="text-xs font-medium text-gray-500 mb-2">Users</div>
                    {suggestions.users.map((user) => (
                      <Link
                        key={user._id}
                        href={`/user/${user.username}`}
                        className="block p-2 hover:bg-gray-50 rounded text-sm"
                        onClick={() => setShowSuggestions(false)}
                      >
                        <div className="font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                        <div className="text-gray-500 text-xs">@{user.username}</div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Write Button */}
            <button
              onClick={handleWriteClick}
              onMouseEnter={prefetchWritePage}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
            >
              <PenTool className="w-4 h-4" />
              <span className="text-sm font-medium">Write</span>
            </button>

            {/* Auth Buttons */}
            {isLoaded && (
              <>
                {user ? (
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-700 font-medium">
                      {user.firstName} {user.lastName}
                    </span>
                    <UserButton 
                      afterSignOutUrl="/"
                      appearance={{
                        elements: {
                          avatarBox: "w-8 h-8"
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <SignInButton mode="modal">
                      <button className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
                        Sign In
                      </button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <button className="border border-gray-300 text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors">
                        Sign Up
                      </button>
                    </SignUpButton>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 