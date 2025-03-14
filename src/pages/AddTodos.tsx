import { useMutation } from '@tanstack/react-query';
import axios from '../utils/AxiosInstance';
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import TodoForm from '../components/TodosForm';

// Define the structure of a Todo item
interface Todo {
  todo: string,
  completed: boolean,
  userId: number
}

// Function to add a new todo via API
const TodoAdd = async (data: Todo) => {
  return await axios.post("/todo/add", data);
}

// Define the AddTodo component
const AddTodos = () => {
  // Initialize mutation for adding a todo
  const { mutate, isSuccess, isPending } = useMutation({
    mutationFn: TodoAdd // Function to handle the mutation
  });
  const navigate = useNavigate(); // Hook for navigation

  // Redirect to the todo list page when the mutation is successful
  useEffect(() => {
    if (isSuccess) {
      navigate("/todo", { replace: true });
    }
  }, [isSuccess]);

  return (
    <div className="bg-white min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">CREATE TODO</h1>
          <button 
            onClick={() => navigate("/todo")}
            className="bg-gray-800 text-white px-4 py-2 border-l-4 border-gray-600"
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              <span>BACK TO LIST</span>
            </div>
          </button>
        </div>
        
        <div className="bg-white border-l-4 border-gray-600">
          {isPending && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex items-center justify-center">
              <div className="bg-white shadow-lg px-6 py-4 flex items-center">
                <svg className="animate-spin h-6 w-6 text-gray-800 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-lg font-medium text-gray-800">Creating todo...</span>
              </div>
            </div>
          )}
          
          <div className="p-6">
            <TodoForm isEdit={false} mutateFn={mutate} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddTodos; // Export the AddTodo component