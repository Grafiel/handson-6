import { Textarea } from '@headlessui/react';
import { UseMutateFunction } from '@tanstack/react-query';
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';

// Define the structure of the form fields
interface postFormFields {
  title: string;
  body: string;
  tags: string;
  reactions: reactionType;
  views: number;
  userId: number;
}

// Define the structure of a post
interface postData {
  title: string;
  body: string;
  tags: string[];
  reactions: reactionType;
  views: number;
  userId: number;
}

// Define the structure of reactions
interface reactionType {
  likes: number,
  dislikes: number
}

// Define the props for the PostForm component
interface PostFormElementProps {
  isEdit: boolean;
  mutateFn: UseMutateFunction<any, Error, postData, unknown>;
  defaultInputData?: postData;
}

// Function to convert an array of strings to a single string with each element on a new line
const ArrStringToTextLine = (arrString: string[]) => {
  let formattedString: string = "";
  for (let i = 0; i < arrString.length; i++) {
    formattedString += arrString[i];
    if (i < arrString.length - 1) {
      formattedString += "\n";
    }
  }
  return formattedString;
}

// Function to convert a single string with newlines into an array of strings
const TextLineToArrString = (TextLine: string) => {
  const arrStrings: string[] = [];
  let temp: string = "";
  for (let i = 0; i < TextLine.length; i++) {
    if (TextLine[i] === "\n" || i == TextLine.length - 1) {
      if(i == TextLine.length - 1) temp += TextLine[i];
      arrStrings.push(temp);
      temp = "";
    } else {
      temp += TextLine[i];
    }
  }
  return arrStrings;
}

// Function to reformat form fields into the postData structure
const reformatPostFormFields = (postFieldsData: postFormFields) => {
  console.log(postFieldsData.tags);
  const reformatedPostDat: postData = {
    title: postFieldsData.title,
    body: postFieldsData.body,
    tags: TextLineToArrString(postFieldsData.tags),
    reactions: postFieldsData.reactions,
    views: postFieldsData.views,
    userId: postFieldsData.userId
  }

  return reformatedPostDat; // Return the reformatted data
}

// Define the PostForm component
const PostForm: React.FC<PostFormElementProps> = (props) => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<postFormFields>(); // Initialize React Hook Form

  // Populate form fields with default data when in edit mode
  useEffect(() => {
    if (props.defaultInputData) {
      setValue("title", props.defaultInputData.title);
      setValue("body", props.defaultInputData.body);
      setValue("tags", ArrStringToTextLine(props.defaultInputData.tags));
      setValue("userId", props.defaultInputData.userId);
    }
  }, [props.defaultInputData]);

  // Handle form submission
  const submitHandler = (data: postFormFields) => {
    if (props.isEdit) {
      if (!confirm("Are you sure want to update post data?")) return;
      
      if(typeof props.defaultInputData?.reactions !== "undefined"){
        data.reactions = {
          likes: props.defaultInputData.reactions.likes,
          dislikes: props.defaultInputData.reactions.dislikes
        }
      }

      if(typeof props.defaultInputData?.views !== "undefined"){
        data.views = props.defaultInputData.views;
      }
    } else {
      data.reactions = {
        likes: 0,
        dislikes: 0
      }
      data.views = 1;
    }

    const reformatedPostDat = reformatPostFormFields(data); // Reformat the data
    console.log(reformatedPostDat);
    props.mutateFn(reformatedPostDat); // Call the mutation function
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
        
        <div className="space-y-2 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700" htmlFor="title">
            Post Title
          </label>
          <input
            type="text"
            id="title"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter a descriptive title"
            {...register('title', { required: "Post title is required." })}
          />
          {errors.title && (
            <p className="mt-2 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700" htmlFor="body">
            Post Content
          </label>
          <Textarea
            id="body"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 min-h-32"
            placeholder="Write your post content here..."
            {...register('body', { required: "Post body is required." })}
          />
          {errors.body && (
            <p className="mt-2 text-sm text-red-600">{errors.body.message}</p>
          )}
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700" htmlFor="tags">
            Tags <span className="text-gray-500 text-xs">(one per line)</span>
          </label>
          <Textarea
            id="tags"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 min-h-24"
            placeholder="Enter tags (one per line)"
            {...register('tags', { required: "Post tags are required." })}
          />
          {errors.tags && (
            <p className="mt-2 text-sm text-red-600">{errors.tags.message}</p>
          )}
          <p className="text-sm text-gray-500">
            Add keywords that describe your post. Each tag should be on a new line.
          </p>
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
          {props.isEdit ? 'Update Post' : 'Create Post'}
        </button>
      </div>
    </form>
  );
}

export default PostForm; // Export the PostForm component