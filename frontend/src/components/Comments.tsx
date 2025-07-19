// 'use client';

// import { useState, useEffect } from 'react';
// import { useUser } from '@clerk/nextjs';
// import { MessageCircle, Send, Trash2 } from 'lucide-react';
// import toast from 'react-hot-toast';

// interface Comment {
//   _id: string;
//   content: string;
//   author: {
//     _id: string;
//     clerkId: string;
//     username: string;
//     firstName: string;
//     lastName: string;
//     profileImage: string;
//   };
//   createdAt: string;
// }

// interface CommentsProps {
//   postId: string;
//   onCommentCountChange?: (count: number) => void;
// }

// export default function Comments({ postId, onCommentCountChange }: CommentsProps) {
//   const { user, isLoaded } = useUser();
//   const [comments, setComments] = useState<Comment[]>([]);
//   const [newComment, setNewComment] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);

//   useEffect(() => {
//     fetchComments();
//   }, [postId]);

//   const fetchComments = async () => {
//     try {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/posts/${postId}/comments`);
//       if (response.ok) {
//         const data = await response.json();
//         setComments(data.comments || []);
//         if (onCommentCountChange) {
//           onCommentCountChange(data.comments?.length || 0);
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching comments:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmitComment = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!user) {
//       toast.error('Please sign in to comment');
//       return;
//     }

//     if (!newComment.trim()) {
//       toast.error('Please enter a comment');
//       return;
//     }

//     setSubmitting(true);

//     try {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/comments`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': 'Bearer dev_token',
//         },
//         body: JSON.stringify({
//           content: newComment.trim(),
//           postId: postId,
//         }),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setComments(prev => [data.comment, ...prev]);
//         setNewComment('');
//         toast.success('Comment posted successfully!');
        
//         // Update comment count
//         if (onCommentCountChange) {
//           onCommentCountChange(comments.length + 1);
//         }
//       } else {
//         const error = await response.json();
//         toast.error(error.message || 'Failed to post comment');
//       }
//     } catch (error) {
//       console.error('Error posting comment:', error);
//       toast.error('Failed to post comment');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleDeleteComment = async (commentId: string) => {
//     if (!user) {
//       toast.error('Please sign in to delete comments');
//       return;
//     }

//     try {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/comments/${commentId}`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': 'Bearer dev_token',
//         },
//       });

//       if (response.ok) {
//         setComments(prev => prev.filter(comment => comment._id !== commentId));
//         toast.success('Comment deleted successfully!');
        
//         // Update comment count
//         if (onCommentCountChange) {
//           onCommentCountChange(comments.length - 1);
//         }
//       } else {
//         const error = await response.json();
//         toast.error(error.message || 'Failed to delete comment');
//       }
//     } catch (error) {
//       console.error('Error deleting comment:', error);
//       toast.error('Failed to delete comment');
//     }
//   };

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', { 
//       month: 'short', 
//       day: 'numeric',
//       year: 'numeric'
//     });
//   };

//   const isCommentOwner = (comment: Comment) => {
//     return user && comment.author.clerkId === 'user_2abc123def456';
//   };

//   if (loading) {
//     return (
//       <div className="mt-8">
//         <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
//           <MessageCircle className="w-5 h-5" />
//           <span>Comments</span>
//         </h3>
//         <div className="space-y-4">
//           {[...Array(3)].map((_, i) => (
//             <div key={i} className="animate-pulse">
//               <div className="flex space-x-3">
//                 <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
//                 <div className="flex-1">
//                   <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
//                   <div className="h-4 bg-gray-200 rounded w-full"></div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="mt-8">
//       <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
//         <MessageCircle className="w-5 h-5" />
//         <span>Comments ({comments.length})</span>
//       </h3>

//       {/* Comment Form */}
//       {user && (
//         <form onSubmit={handleSubmitComment} className="mb-6">
//           <div className="flex space-x-3">
//             <div className="flex-1">
//               <textarea
//                 value={newComment}
//                 onChange={(e) => setNewComment(e.target.value)}
//                 placeholder="Write a comment..."
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
//                 rows={3}
//                 disabled={submitting}
//               />
//               <div className="flex justify-end mt-2">
//                 <button
//                   type="submit"
//                   disabled={submitting || !newComment.trim()}
//                   className="flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
//                 >
//                   <Send className="w-4 h-4" />
//                   <span>{submitting ? 'Posting...' : 'Post Comment'}</span>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </form>
//       )}

//       {/* Comments List */}
//       <div className="space-y-4">
//         {comments.length === 0 ? (
//           <p className="text-gray-500 text-center py-8">No comments yet. Be the first to comment!</p>
//         ) : (
//           comments.map((comment) => (
//             <div key={comment._id} className="border-b border-gray-100 pb-4">
//               <div className="flex items-center justify-between mb-1">
//                 <div className="flex items-center space-x-2">
//                   <span className="text-sm font-medium text-gray-900">
//                     {comment.author.firstName} {comment.author.lastName}
//                   </span>
//                   <span className="text-gray-400">•</span>
//                   <span className="text-sm text-gray-500">
//                     {formatDate(comment.createdAt)}
//                   </span>
//                 </div>
//                 {isCommentOwner(comment) && (
//                   <button
//                     onClick={() => handleDeleteComment(comment._id)}
//                     className="text-gray-400 hover:text-red-500 transition-colors p-1"
//                     title="Delete comment"
//                   >
//                     <Trash2 className="w-4 h-4" />
//                   </button>
//                 )}
//               </div>
//               <p className="text-gray-700 text-sm">{comment.content}</p>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// } 
'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { MessageCircle, Send, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface Comment {
  _id: string;
  content: string;
  author: {
    _id: string;
    clerkId: string;
    username: string;
    firstName: string;
    lastName: string;
    profileImage: string;
  };
  createdAt: string;
}

interface CommentsProps {
  postId: string;
  onCommentCountChange?: (count: number) => void;
}

export default function Comments({ postId, onCommentCountChange }: CommentsProps) {
  const { user } = useUser();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/posts/${postId}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments || []);
        if (onCommentCountChange) {
          onCommentCountChange(data.comments?.length || 0);
        }
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please sign in to comment');
      return;
    }

    if (!newComment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // TODO: Replace dev_token with real token in production
          'Authorization': 'Bearer dev_token',
        },
        body: JSON.stringify({
          content: newComment.trim(),
          postId: postId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setComments(prev => [data.comment, ...prev]);
        setNewComment('');
        toast.success('Comment posted successfully!');

        if (onCommentCountChange) {
          onCommentCountChange(comments.length + 1);
        }
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to post comment');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      toast.error('Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!user) {
      toast.error('Please sign in to delete comments');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          // TODO: Replace dev_token with real token in production
          'Authorization': 'Bearer dev_token',
        },
      });

      if (response.ok) {
        setComments(prev => prev.filter(comment => comment._id !== commentId));
        toast.success('Comment deleted successfully!');

        if (onCommentCountChange) {
          onCommentCountChange(comments.length - 1);
        }
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to delete comment');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isCommentOwner = (comment: Comment) => {
    return user && comment.author.clerkId === user.id;
  };

  if (loading) {
    return (
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <MessageCircle className="w-5 h-5" />
          <span>Comments</span>
        </h3>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
        <MessageCircle className="w-5 h-5" />
        <span>Comments ({comments.length})</span>
      </h3>

      {user && (
        <form onSubmit={handleSubmitComment} className="mb-6">
          <div className="flex space-x-3">
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                rows={3}
                disabled={submitting}
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={submitting || !newComment.trim()}
                  className="flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Posting...' : 'Post Comment'}</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="border-b border-gray-100 pb-4">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">
                    {comment.author.firstName} {comment.author.lastName}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm text-gray-500">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                {isCommentOwner(comment) && (
                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    title="Delete comment"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <p className="text-gray-700 text-sm">{comment.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
