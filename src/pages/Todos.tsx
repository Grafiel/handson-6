import { useMutation, useQuery } from '@tanstack/react-query'
import axios from '../utils/AxiosInstance'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

// Define the structure of a single todo item
interface Todos {
    id: number,
    todo: string,
    completed: boolean,
    userId: number
}

// Define the structure of the response containing multiple todos
interface TodoList {
    todos: Todos[] 
}

// Define the structure of a deleted todo
interface DeletedTodo extends Todos {
    isDeleted: Boolean;
    deletedOn: string;
}

// Function to fetch the list of todos from the API
const fetchTodoList = async () => {
    return axios.get<TodoList>('/todo')
}

// Function to delete a todo by its ID
const deleteTodo = async (id: string | undefined) => {
    return await axios.delete<DeletedTodo>(`todo/${id}`);
};

// Component to display a skeleton loader while todos are being fetched
const TodoSkeleton = () => {
    return (
        <div className="bg-white border-l-4 border-gray-300 mb-6">
            <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                    <div className="bg-gray-200 animate-pulse h-5 w-5 rounded"></div>
                    <div className="bg-gray-200 animate-pulse h-5 w-32 rounded mb-2"></div>
                    <div className="flex-1"></div>
                    <div className="bg-gray-200 animate-pulse h-6 w-6 rounded-full"></div>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-300">
                    <div className="bg-gray-200 animate-pulse h-4 w-24 rounded"></div>
                </div>
            </div>
        </div>
    )
}

// Main Todo component
const Todos = () => {
    const [activeMenu, setActiveMenu] = useState<number | null>(null); // State to track the active menu for a todo
    
    // Fetch the list of todos using React Query
    const getTodoList = useQuery({
        queryKey: ["Todo"],
        queryFn: fetchTodoList
    });

    // Initialize mutation for deleting a todo
    const deleteTodoMutation = useMutation(
        {
            mutationFn: (id: string) => deleteTodo(id), // Function to delete a todo
            onSuccess: () => {
                getTodoList.refetch(); // Refetch the todo list after successful deletion
            }
        }
    )

    const navigate = useNavigate(); // Hook for navigation

    // Toggle the visibility of the menu for a specific todo
    const toggleMenu = (todoId: number) => {
        if (activeMenu === todoId) {
            setActiveMenu(null);
        } else {
            setActiveMenu(todoId);
        }
    };

    // Close menu when clicking outside
    const handleClickOutside = () => {
        setActiveMenu(null); // Reset the active menu
    };

    return (
        <div className="bg-white min-h-screen py-8" onClick={handleClickOutside}>
            <div className="max-w-4xl mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">TODOS</h1>
                    <button 
                        onClick={() => navigate("./add")}
                        className="bg-gray-800 text-white px-4 py-2 border-l-4 border-gray-600"
                    >
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                            </svg>
                            <span>NEW TODO</span>
                        </div>
                    </button>
                </div>

                <div className="space-y-0">
                    {getTodoList.isFetching ? (
                        Array.from({ length: 5 }).map((_, index) => <TodoSkeleton key={index} />)
                    ) : (
                        getTodoList.data?.data.todos.map((todo) => (
                            <div 
                                key={todo.id} 
                                className={`bg-white border-l-4 ${todo.completed ? 'border-green-600' : 'border-gray-600'} mb-6`}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="p-6">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className={`flex-shrink-0 h-5 w-5 rounded flex items-center justify-center ${
                                            todo.completed ? 'bg-green-100 text-green-600 border border-green-600' : 'border border-gray-600'
                                        }`}>
                                            {todo.completed && (
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                </svg>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className={`${
                                                todo.completed ? 'text-gray-500 line-through' : 'text-gray-800'
                                            }`}>
                                                {todo.todo}
                                            </p>
                                        </div>
                                        <div className="relative group">
                                            <button 
                                                className="p-2 text-gray-400"
                                                onClick={() => toggleMenu(todo.id)}
                                            >
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <circle cx="12" cy="6" r="2"></circle>
                                                    <circle cx="12" cy="12" r="2"></circle>
                                                    <circle cx="12" cy="18" r="2"></circle>
                                                </svg>
                                            </button>
                                            {activeMenu === todo.id && (
                                                <div className="absolute right-0 mt-2 w-40 bg-white text-gray-800 z-10 shadow-md border border-gray-200">
                                                    <button
                                                        onClick={() => {
                                                            navigate(`${todo.id}/edit`);
                                                            setActiveMenu(null);
                                                        }}
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
                                                        className="block w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-gray-100"
                                                        onClick={() => {
                                                            if (confirm("Are you sure you want to delete this todo?")) {
                                                                deleteTodoMutation.mutate(todo.id.toString());
                                                            }
                                                            setActiveMenu(null);
                                                        }}
                                                    >
                                                        <div className="flex items-center">
                                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                            </svg>
                                                            Delete
                                                        </div>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center pt-3 border-t border-gray-300">
                                        <span className="text-xs text-gray-400 font-mono">User ID: {todo.userId}</span>
                                        <span className="text-xs text-gray-400 font-mono">ID: {todo.id}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

export default Todos;