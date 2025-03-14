import { useMutation } from "@tanstack/react-query";
import axios from "../utils/AxiosInstance";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RecipeForm, { Recipe } from "../components/RecipesForm";

// Function to add a new recipe via API
const addRecipe = async (data: Recipe) => {
  return await axios.post("/recipes/add", data);
};

// Define the AddRecipes component
const AddRecipes = () => {
  // Initialize mutation for adding a new recipe
  const addRecipeMutation = useMutation({
    mutationFn: addRecipe
  });
  const navigate = useNavigate(); // Hook for navigation

  // Redirect to the recipes list page when the mutation is successful
  useEffect(() => {
    if (addRecipeMutation.isSuccess) {
      navigate("/recipes", { replace: true });
    }
  }, [addRecipeMutation.isSuccess, navigate]);

  return (
    <div className="bg-white min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">ADD RECIPE</h1>
          <button 
            onClick={() => navigate("/recipes")}
            className="bg-gray-800 text-white px-4 py-2 border-l-4 border-gray-600"
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              <span>BACK TO RECIPES</span>
            </div>
          </button>
        </div>

        {addRecipeMutation.isPending && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg flex items-center">
              <svg className="animate-spin h-6 w-6 text-gray-800 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-lg font-medium text-gray-800">Creating recipe...</span>
            </div>
          </div>
        )}

        <RecipeForm 
          isEdit={false} 
          mutateFn={addRecipeMutation.mutate} 
        />
      </div>
    </div>
  );
};

export default AddRecipes;