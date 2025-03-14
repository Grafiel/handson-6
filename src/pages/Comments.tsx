import { useMutation, useQuery } from '@tanstack/react-query'
import axios from '../utils/AxiosInstance'
import { useNavigate } from 'react-router-dom'

// Define the structure of a single comment
interface Comment {
    id: number,
    body: string,
    postId: number,
    likes: number
    user: {
        id: number,
        username: string,
        fullName: string
    }
}

// Define the structure of the response containing multiple comments
interface Comments {
    comments: Comment[]
}

// Define the structure of a deleted comment
interface DeletedComment extends Comment {
    isDeleted: Boolean;
    deletedOn: string;
}

// Function to fetch comments from the API
const fetchCommentsDat = async () => {
    return axios.get<Comments>('/comments')
}

// Function to delete a comment by its ID
const deleteComments = async (id: string | undefined) => {
    return await axios.delete<DeletedComment>(`/comments/${id}`);
};

// Component to display a skeleton loader while comments are being fetched
const CommentsSkeleton = () => {
    return (
        <div className='bg-white border-l-4 border-gray-300 mb-6'>
            <div className='p-6'>
                <div className='flex items-center gap-3 mb-3'>
                    <div className="bg-gray-200 animate-pulse h-12 w-12 rounded-full"></div>
                    <div className='flex-1'>
                        <div className="bg-gray-200 animate-pulse h-5 w-32 rounded mb-2"></div>
                        <div className="bg-gray-200 animate-pulse h-3 w-24 rounded"></div>
                    </div>
                    <div className="bg-gray-200 animate-pulse h-6 w-6 rounded-full"></div>
                </div>
                <div className="bg-gray-200 animate-pulse h-16 w-full rounded mb-3"></div>
                <div className='flex justify-between items-center pt-3 border-t border-gray-300'>
                    <div className="bg-gray-200 animate-pulse h-4 w-24 rounded"></div>
                    <div className="bg-gray-200 animate-pulse h-4 w-8 rounded"></div>
                </div>
            </div>
        </div>
    );
}

// Main component to display and manage comments
const Comments = () => {
    // Fetch comments using React Query
    const getCommentDat = useQuery({
        queryKey: ["comments"],
        queryFn: fetchCommentsDat
    });

    // Mutation to delete a comment
    const deleteCommentDat = useMutation(
        { mutationFn: (id: string) => deleteComments(id) }
    )

    const navigate = useNavigate(); // Hook for navigation

    return (
        <div className="bg-white min-h-screen py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">COMMENTS</h1>
                    <button 
                        onClick={() => navigate("/comments/add")}
                        className="bg-gray-800 text-white px-4 py-2 border-l-4 border-gray-600"
                    >
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                            </svg>
                            <span>NEW COMMENT</span>
                        </div>
                    </button>
                </div>

                <div className="space-y-0">
                    {getCommentDat.isFetching ?
                        Array.from({ length: 3 }).map((_, index) => <CommentsSkeleton key={index} />)
                        : getCommentDat.data?.data.comments.map((comment) => (
                            <div key={comment.id} className="bg-white border-l-4 border-gray-600 mb-6">
                                <div className="p-6">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="flex-shrink-0">
                                            <div className="h-12 w-12 bg-gray-800 flex items-center justify-center text-white">
                                                <span className="font-mono">{comment.user.fullName.charAt(0)}</span>
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-800">{comment.user.fullName}</h3>
                                            <p className="text-xs text-gray-500 font-mono">@{comment.user.username}</p>
                                        </div>
                                        <div className="relative group">
                                            <button className="p-2 text-gray-400">
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <circle cx="12" cy="6" r="2"></circle>
                                                    <circle cx="12" cy="12" r="2"></circle>
                                                    <circle cx="12" cy="18" r="2"></circle>
                                                </svg>
                                            </button>
                                            <div className="absolute right-0 mt-2 w-40 bg-white text-gray-800 z-10 hidden group-focus-within:block shadow-md border border-gray-200">
                                                <button
                                                    onClick={() => navigate(`/comments/${comment.id}/edit`)}
                                                    className="block w-full text-left px-4 py-3 text-sm border-b border-gray-200 hover:bg-gray-100">
                                                    <div className="flex items-center">
                                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                                        </svg>
                                                        Edit
                                                    </div>
                                                </button>
                                                <button
                                                    className="block w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-gray-100"
                                                    onClick={() => {
                                                        if (confirm("Are you sure you want to delete this comment?")) {
                                                            deleteCommentDat.mutate(comment.id.toString());
                                                        }
                                                    }}>
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
                                    <div className="text-gray-600 mb-5 pl-3 border-l-2 border-gray-300">
                                        <p>{comment.body}</p>
                                    </div>
                                    <div className="flex justify-between items-center pt-4 border-t border-gray-300">
                                        <div className="flex items-center text-gray-500">
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
                                            </svg>
                                            <span className="font-mono">{comment.likes}</span>
                                        </div>
                                        <span className="text-xs text-gray-400 font-mono">ID: {comment.id}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default Comments // Export the Comments component