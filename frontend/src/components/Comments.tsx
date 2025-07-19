'use client';

import { useEffect, useState } from 'react';
import { Comment } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { UserResource } from '@clerk/types'; // ✅ Make sure this is here

interface CommentsProps {
  postId: string;
  user?: UserResource | null; // ✅ This line is the fix
  onCommentCountChange: (count: number) => void;
}

export default function Comments({ postId, user, onCommentCountChange }: CommentsProps) {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    fetch(`/api/comments/${postId}`)
      .then(res => res.json())
      .then(data => {
        setComments(data);
        onCommentCountChange(data.length); // Update the parent with comment count
      });
  }, [postId, onCommentCountChange]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const res = await fetch('/api/comments', {
      method: 'POST',
      body: JSON.stringify({ postId, message: comment }),
      headers: { 'Content-Type': 'application/json' }
    });

    const newComment = await res.json();
    setComments(prev => [newComment, ...prev]);
    setComment('');
    onCommentCountChange(comments.length + 1);
  };

  return (
    <div className="mt-10">
      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          className="w-full p-2 border rounded"
          rows={3}
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Comment
        </button>
      </form>

      <div>
        {comments.map((c, i) => (
          <div key={i} className="border-b py-4">
            <p className="text-gray-700">{c.message}</p>
            <p className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
