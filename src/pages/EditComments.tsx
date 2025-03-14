import { useMutation, useQuery } from '@tanstack/react-query';
import axios from '../utils/AxiosInstance';
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import CommentFrom from '../components/CommentsForm';

// Define the structure of a comment
interface Comment {
  body: string,
  postId: number,
  user: {
    id: number
  }
}

// Function to update a comment via API
const CommentEdit = async (data: Comment, id: string | undefined) => {
  return await axios.put(`/comments/${id}`, data);
}

// Function to fetch a specific comment by its ID
const fetchCommentDat = (id: string | undefined) => {
  return axios.get<Comment>(`/comments/${id}`);
}

// Define the EditComment component
const EditComments = () => {
  const { id } = useParams();
  
  // Fetch the comment data using React Query
  const getCommentData = useQuery({
    queryKey: ["CommentDat", id],
    queryFn: () => fetchCommentDat(id)
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
  }, [isSuccess, navigate]);

  return (
    <div className="bg-white min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">EDIT COMMENT</h1>
        </div>
        
        <div className="bg-white border-l-4 border-gray-600 mb-6">
          {isPending && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
              <div className="bg-white border-l-4 border-gray-600 px-6 py-3 flex items-center">
                <span className="text-xl font-mono text-gray-800">Updating...</span>
              </div>
            </div>
          )}
          <div className="p-6">
            <CommentFrom isEdit={true} mutateFn={mutate} defaultInputData={getCommentData.data?.data} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditComments // Export the EditComment component