import { useMutation } from '@tanstack/react-query';
import axios from '../utils/AxiosInstance';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PostForm from '../components/PostForm';

// Define the structure of a post
interface postDat {
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

// Function to add a new post via API
const addPost = async (data: postDat) => {
  return await axios.post('/posts', data);
};

// Define the PostAdd component
const AddPost = () => {
  // Initialize mutation for adding a post
  const { mutate, isSuccess, isPending } = useMutation({ mutationFn: addPost });
  const navigate = useNavigate();

  // Redirect to the posts page when the mutation is successful
  useEffect(() => {
    if (isSuccess) {
      navigate('/posts', { replace: true });
    }
  }, [isSuccess, navigate]);

  return (
    <div className="bg-white min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">NEW POST</h1>
        </div>
        
        <div className="bg-white border-l-4 border-gray-600 mb-6 relative">
          {isPending && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex items-center justify-center">
              <div className="bg-white border-l-4 border-gray-600 px-6 py-3 flex items-center">
                <span className="text-xl font-mono text-gray-800">Creating post...</span>
              </div>
            </div>
          )}
          
          <div className="p-6">
            <PostForm isEdit={false} mutateFn={mutate} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPost; // Export the PostAdd component