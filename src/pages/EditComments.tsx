import { useMutation, useQuery } from '@tanstack/react-query';
import axios from '../utils/AxiosInstance';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CommentForm from '../components/CommentForm';

// Define the structure of a comment
interface Comment {
  id?: number,
  body: string,
  postId: number,
  user: {
    id: number
  }
}

// Function to update a comment via API
const CommentEdit = async (data: Comment, id: string | undefined) => {
  return await axios.put(`/comments/${id}`, data);
};

// Function to fetch a specific comment by its ID
const fetchCommentData = (id: string | undefined) => {
  return axios.get<Comment>(`/comments/${id}`);
};

// Component to display a skeleton loader while comment is being fetched
const EditCommentSkeleton = () => {
  return (
    <div className="bg-white border-l-4 border-gray-300 p-6">
      <div className="bg-gray-200 animate-pulse h-8 w-48 rounded mb-6 mx-auto"></div>
      <div className="bg-gray-200 animate-pulse h-32 w-full rounded mb-6"></div>
      <div className="flex justify-center gap-4">
        <div className="bg-gray-200 animate-pulse h-10 w-24 rounded"></div>
        <div className="bg-gray-200 animate-pulse h-10 w-24 rounded"></div>
      </div>
    </div>
  );
};

// Define the EditComment component
const EditComments = () => {
  const { id } = useParams();
  
  // Fetch the comment data using React Query
  const getCommentData = useQuery({
    queryKey: ["commentData", id],
    queryFn: () => fetchCommentData(id)
  });

  // Initialize mutation for updating the comment
  const { mutate, isSuccess, isPending } = useMutation({
    mutationFn: (data: Comment) => CommentEdit(data, id)
  });
  
  const navigate = useNavigate(); // Hook for navigation
  
  // Redirect to the comments page when the mutation is successful
  useEffect(() => {
    if (isSuccess) {
      navigate("/comments", { replace: true });
    }
  }, [isSuccess]);

  return (
    <div className="bg-white min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">EDIT COMMENT</h1>
          <button 
            onClick={() => navigate("/comments")}
            className="bg-gray-800 text-white px-4 py-2 border-l-4 border-gray-600"
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              <span>BACK</span>
            </div>
          </button>
        </div>

        {isPending && (
          <div className="fixed inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="flex items-center bg-white px-6 py-3 border-l-4 border-gray-600 shadow-lg">
              <span className="text-xl font-mono text-gray-800">Updating comment...</span>
            </div>
          </div>
        )}

        <div className="bg-white border-l-4 border-gray-600 mb-6">
          {getCommentData.isFetching ? (
            <EditCommentSkeleton />
          ) : (
            <div className="p-6">
              <CommentForm 
                isEdit={true} 
                mutateFn={mutate} 
                defaultInputData={getCommentData.data?.data} 
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditComments; // Export the EditComment component