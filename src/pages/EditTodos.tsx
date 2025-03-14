import { useMutation, useQuery } from '@tanstack/react-query';
import axios from '../utils/AxiosInstance';
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import TodoForm from '../components/TodosForm';

// Define the structure of a Todo item
interface Todo {
  todo: string,
  completed: boolean,
  userId: number
}

// Function to update a todo via API
const TodoEdit = async (data: Todo, id: string | undefined) => {
  return await axios.put(`/todo/${id}`, data);
};

// Function to fetch the details of a specific todo by its ID
const fetchTodoDat = (id: string | undefined) => {
  return axios.get<Todo>(`/todo/${id}`);
}

// Define the EditTodo component
const EditTodos = () => {
  const { id } = useParams();
  
  // Fetch the todo data using React Query
  const getTodoDat = useQuery({
    queryKey: ["TodoDat", id],
    queryFn: () => fetchTodoDat(id)
  });

  const navigate = useNavigate(); // Hook for navigation

  // Initialize mutation for updating the todo
  const editTodoMutation = useMutation({
    mutationFn: (data: Todo) => TodoEdit(data, id) // Mutation function to handle the update
  });

  // Redirect to the todo list page when the mutation is successful
  useEffect(() => {
    if (editTodoMutation.isSuccess) {
      navigate("/todo", { replace: true });
    }
  }, [editTodoMutation.isSuccess]);

  return (
    <div className="bg-white min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">EDIT TODO</h1>
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
          {editTodoMutation.isPending && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex items-center justify-center">
              <div className="bg-white shadow-lg px-6 py-4 flex items-center">
                <svg className="animate-spin h-6 w-6 text-gray-800 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-lg font-medium text-gray-800">Updating todo...</span>
              </div>
            </div>
          )}
          
          <div className="p-6">
            <TodoForm 
              isEdit={true} 
              mutateFn={editTodoMutation.mutate} 
              defaultInputData={getTodoDat.data?.data} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditTodos; // Export the EditTodo component