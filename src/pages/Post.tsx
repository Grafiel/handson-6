import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "../utils/AxiosInstance";
import { useNavigate } from "react-router-dom";

// Define the structure of a post
interface postData {
  id: number;
  title: string;
  body: string;
  tags: string[];
  reactions: reactionType;
  views: number;
  userId: number;
}

// Define the structure of reactions
interface reactionType {
  likes: number;
  dislikes: number;
}

// Define the structure of the response containing multiple posts
interface postList {
  posts: postData[];
}

// Function to fetch posts from the API
const fetchPostData = async () => {
  return await axios.get<postList>("/posts");
};

// Define the structure of a deleted post
interface DeletedPost extends postData {
  isDeleted: Boolean;
  deletedOn: string;
}

// Function to delete a post by its ID
const deletePost = async (id: string | undefined) => {
  return await axios.delete<DeletedPost>(`/posts/${id}`);
};

// Component to display a single post card
const PostCard: React.FC<postData> = (post: postData) => {
  const deletePostMutation = useMutation({
    mutationFn: (id: string) => deletePost(id),
  });
  const navigate = useNavigate();
  
  return (
    <div className="bg-white border-l-4 border-gray-600 mb-6">
      <div className="p-6">
        {/* Header section with user info */}
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-800 flex items-center justify-center text-white">
              <span className="font-mono">{post.userId}</span>
            </div>
            <p className="font-mono text-gray-700">User #{post.userId}</p>
          </div>
          
          {/* Menu button */}
          <div className="relative group">
            <button className="p-2 text-gray-400">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="6" r="2"></circle>
                <circle cx="12" cy="12" r="2"></circle>
                <circle cx="12" cy="18" r="2"></circle>
              </svg>
            </button>
            
            {/* Dropdown menu */}
            <div className="absolute right-0 mt-2 w-40 bg-white text-gray-800 z-10 hidden group-focus-within:block shadow-md border border-gray-200">
              <button
                onClick={() => navigate(`/posts/${post.id}/edit`)}
                className="block w-full text-left px-4 py-3 text-sm border-b border-gray-200 hover:bg-gray-100"
              >
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                  Edit
                </div>
              </button>
              <button
                onClick={() => {
                  if (confirm("Are you sure want to delete this post?")) {
                    deletePostMutation.mutate(post.id.toString());
                  }
                }}
                className="block w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-gray-100"
              >
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                  Delete
                </div>
              </button>
            </div>
          </div>
        </div>
        
        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-3 border-b border-gray-300 pb-2">{post.title}</h2>
        
        {/* Post content */}
        <div className="text-gray-600 mb-5 pl-3 border-l-2 border-gray-300">
          {post.body}
        </div>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-5">
          {post.tags.map((tag, index) => (
            <span key={index} className="bg-gray-200 text-gray-700 text-xs px-3 py-1 font-mono">
              #{tag}
            </span>
          ))}
        </div>
        
        {/* Footer with stats */}
        <div className="grid grid-cols-3 pt-4 border-t border-gray-300 text-center">
          <div className="flex items-center justify-center text-gray-500">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
            </svg>
            <span className="font-mono">{post.views}</span>
          </div>
          
          <button className="flex items-center justify-center text-gray-500">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
            </svg>
            <span className="font-mono">{post.reactions.likes}</span>
          </button>
          
          <button className="flex items-center justify-center text-gray-500">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"></path>
            </svg>
            <span className="font-mono">{post.reactions.dislikes}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Skeleton loader for posts
const PostSkeleton = () => {
  return (
    <div className="bg-white border-l-4 border-gray-300 mb-6">
      <div className="p-6">
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-200 animate-pulse"></div>
            <div className="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>
          <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
        </div>
        
        <div className="h-7 bg-gray-200 rounded w-3/4 mb-3 animate-pulse"></div>
        <div className="border-b border-gray-300 pb-2 mb-3"></div>
        
        <div className="space-y-2 mb-5 pl-3 border-l-2 border-gray-300">
          <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-5">
          <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-12 animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-3 pt-4 border-t border-gray-300">
          <div className="h-5 bg-gray-200 rounded w-16 mx-auto animate-pulse"></div>
          <div className="h-5 bg-gray-200 rounded w-16 mx-auto animate-pulse"></div>
          <div className="h-5 bg-gray-200 rounded w-16 mx-auto animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

// Main Post component
const Post = () => {
  const getPostData = useQuery({
    queryKey: ["postDat"],
    queryFn: fetchPostData,
  });
  const navigate = useNavigate();
  
  return (
    <div className="bg-white min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">POSTS</h1>
          <button 
            onClick={() => navigate("/posts/add")}
            className="bg-gray-800 text-white px-4 py-2 border-l-4 border-gray-600"
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
              </svg>
              <span>NEW POST</span>
            </div>
          </button>
        </div>
        
        <div className="space-y-0">
          {getPostData.isFetching
            ? Array.from({ length: 3 }).map((_, index) => (
                <PostSkeleton key={index} />
              ))
            : getPostData.data?.data.posts.map((post) => (
                <PostCard key={post.id} {...post} />
              ))}
        </div>
      </div>
    </div>
  );
};

export default Post;