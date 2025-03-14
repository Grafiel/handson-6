import { useMutation } from '@tanstack/react-query';
import axios from '../utils/AxiosInstance';
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import CommentFrom from '../components/CommentsForm';

// Define the structure of a comment
interface Comment {
  body: string,
  postId: number,
  user: {
    id: number
  }
}

// Function to add a new comment via API
const CommentAdd = async (data: Comment) => {
  return await axios.post("/comments", data);
}

// Define the AddComment component
const AddComments = () => {
  // Initialize mutation for adding a comment
  const { mutate, isSuccess, isPending } = useMutation({
    mutationFn: CommentAdd // Function to handle the mutation
  });
  const navigate = useNavigate(); // Hook for navigation

  // Redirect to the comments page when the mutation is successful
  useEffect(() => {
    if (isSuccess) {
      navigate("/comments", { replace: true });
    }
  }, [isSuccess, navigate]);

  return (
    <div className="bg-white min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">NEW COMMENT</h1>
        </div>
        
        <div className="bg-white border-l-4 border-gray-600 mb-6 relative">
          {isPending && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex items-center justify-center">
              <div className="bg-white border-l-4 border-gray-600 px-6 py-3 flex items-center">
                <span className="text-xl font-mono text-gray-800">Creating comment...</span>
              </div>
            </div>
          )}
          
          <div className="p-6">
            <CommentFrom isEdit={false} mutateFn={mutate} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddComments // Export the AddComment component