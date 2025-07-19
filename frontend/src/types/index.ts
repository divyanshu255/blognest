// types.ts

export interface User {
  _id: string;
  clerkId: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
  bio?: string;
  isVerified: boolean;
  fullName: string;
  followerCount: number;
  followingCount: number;
  followers: User[];
  following: User[];
  createdAt: string;
  isFollowing?: boolean;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  color: string;
  description?: string;
}

export interface Post {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage?: string;
  author: User;
  categories: Category[];
  status: 'draft' | 'published';
  isPublished: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  likes: Array<{ user: string; createdAt: string }>;
  isLiked?: boolean;
  viewCount?: number;
  commentCount?: number;
}

// ✅ Add this to support the Comments.tsx page
export interface Comment {
  _id: string;
  postId: string;
  message: string;
  createdAt: string;
  user: {
    _id: string;
    username: string;
    profileImage?: string;
  };
}
