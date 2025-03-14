import { useMutation, useQuery } from '@tanstack/react-query';
import axios from '../utils/AxiosInstance';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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

// Function to fetch the details of a specific post by its ID
export const fetchPostDetail = async (id: string | undefined) => {
  return await axios.get<postDat>(`/posts/${id}`);
};

// Function to update a post via API
const editPost = async (data: postDat, id: string | undefined) => {
  return await axios.put(`/posts/${id}`, data);
};

// Define the PostEdit component
const EditPost = () => {
  const { id } = useParams(); // Get the post ID from the URL parameters

  // Initialize mutation for updating the post
  const { mutate, isSuccess, isPending } = useMutation({
    mutationFn: (data: postDat) => editPost(data, id), // Mutation function to handle the update
  });

  // Fetch the post data using React Query
  const getPostData = useQuery({
    queryKey: ['postDatDetail', id],
    queryFn: () => fetchPostDetail(id),
  });

  const navigate = useNavigate(); // Hook for navigation

  // Redirect to the posts page when the mutation is successful
  useEffect(() => {
    if (isSuccess) {
      navigate('/posts', { replace: true });
    }
  }, [isSuccess, navigate]);

  return (
    <div className="bg-white min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">EDIT POST</h1>
        </div>
        
        <div className="bg-white border-l-4 border-gray-600 mb-6">
          {isPending && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
              <div className="flex items-center bg-white px-6 py-3 border-l-4 border-gray-600">
                <span className="text-xl font-mono text-gray-800">Updating...</span>
              </div>
            </div>
          )}
          <div className="p-6">
            <PostForm isEdit={true} mutateFn={mutate} defaultInputData={getPostData.data?.data} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPost; // Export the PostEdit component