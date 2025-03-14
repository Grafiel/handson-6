import { UseMutateFunction } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

// Define the structure of a comment
interface Comment {
  body: string,
  postId: number,
  user: {
    id: number
  }
}

// Define the structure of the comment form fields
interface CommentFormFields {
  body: string,
  postId: number,
  userId: number
}

// Define the props for the CommentForm component
interface CommentFormProps {
  isEdit: boolean;
  mutateFn: UseMutateFunction<any, Error, Comment, unknown>;
  defaultInputData?: Comment;
}

// Define the CommentForm component
const CommentFrom: React.FC<CommentFormProps> = (props) => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<CommentFormFields>();

  // Populate form fields with default data when in edit mode
  useEffect(() => {
    if (props.defaultInputData) {
      setValue("userId", props.defaultInputData.user.id);
      setValue("postId", props.defaultInputData.postId);
      setValue("body", props.defaultInputData.body);
    }
  }, [props.defaultInputData]);

  // Hande form submission
  const submitHandler = (data: CommentFormFields) => {
    if (props.isEdit) {
      if (!confirm("Are you sure want to update comment data?")) return;
    }

    // Create a new comment object
    const newComment: Comment = {
      body: data.body,
      postId: data.postId,
      user: {
        id: data.userId
      }
    }
    props.mutateFn(newComment); // Call the mutation function with the new comment
  }

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700" htmlFor="userId">
            User ID
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <input
              type="number"
              id="userId"
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="User ID"
              {...register('userId', { required: "User ID is required." })}
            />
          </div>
          {errors.userId && (
            <p className="mt-2 text-sm text-red-600">{errors.userId.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700" htmlFor="postId">
            Post ID
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 20a2 2 0 002-2V8a2 2 0 00-2-2h-5M5 14h14" />
              </svg>
            </div>
            <input
              type="number"
              id="postId"
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Post ID"
              {...register('postId', { required: "Post ID is required." })}
            />
          </div>
          {errors.postId && (
            <p className="mt-2 text-sm text-red-600">{errors.postId.message}</p>
          )}
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700" htmlFor="body">
            Comment Content
          </label>
          <textarea
            id="body"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 min-h-32"
            placeholder="Write your comment here..."
            {...register('body', { required: "Comment body is required." })}
          />
          {errors.body && (
            <p className="mt-2 text-sm text-red-600">{errors.body.message}</p>
          )}
        </div>
      </div>
      
      <div className="pt-4 flex justify-end">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="mr-4 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className={`py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            props.isEdit
              ? 'bg-gray-700 hover:bg-gray-900 focus:ring-gray-800'
              : 'bg-gray-700 hover:bg-gray-900 focus:ring-gray-800'
          }`}
        >
          {props.isEdit ? 'Update Comment' : 'Add Comment'}
        </button>
      </div>
    </form>
  );
}

export default CommentFrom // Export the CommentForm component