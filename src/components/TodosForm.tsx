import { UseMutateFunction } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

// Define the structure of a Todo item
interface Todo{
    todo : string;
    completed: boolean;
    userId : number;
}

// Define the structure of the form fields
interface TodoFormFields{
    todo : string
    userId: number;
}

// Define the props for the TodoForm component
interface TodoFormElementProps{
    isEdit: boolean;
    mutateFn: UseMutateFunction<any, Error, Todo, unknown>;
    defaultInputData?: Todo;
}

// Define the TodoForm component
const TodoForm : React.FC<TodoFormElementProps> = (props) => {
    const {register, handleSubmit, setValue, formState : {errors}} = useForm<TodoFormFields>()

    // Populate form fields with default data when in edit mode
    useEffect(() => {
      if (props.defaultInputData) {
        setValue("todo", props.defaultInputData.todo);
        setValue("userId", props.defaultInputData.userId);
      }
    }, [props.defaultInputData]);

    // Handle form submission
    const submitHandler = (data : TodoFormFields) => {
        if (props.isEdit) {
            if (!confirm("Are you sure want to update todo data?")) return; // Confirm before updating
        }

        // Create a new Todo object
        const newTodoDat : Todo = {
            todo : data.todo,
            userId : data.userId,
            completed : false
        }

        props.mutateFn(newTodoDat); // Call the mutation function with the new Todo object
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
                            {...register("userId", {required: "User ID is required."})}
                        />
                    </div>
                    {errors.userId && (
                        <p className="mt-2 text-sm text-red-600">{errors.userId.message}</p>
                    )}
                </div>
                
                <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="todo">
                        Todo Description
                    </label>
                    <textarea
                        id="todo"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 min-h-32"
                        placeholder="What needs to be done?"
                        {...register("todo", {required: "Todo description is required."})}
                    />
                    {errors.todo && (
                        <p className="mt-2 text-sm text-red-600">{errors.todo.message}</p>
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
                    {props.isEdit ? 'Update Todo' : 'Create Todo'}
                </button>
            </div>
        </form>
    );
}

export default TodoForm; // Export the TodoForm component