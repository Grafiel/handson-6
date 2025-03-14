import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../utils/AxiosInstance";
import RecipeForm, { Recipe } from "../components/RecipesForm";
import { fetchRecipeDetail } from "./Recipes";

// Function to edit a recipe via API
const editRecipe = async (data: Recipe, id: string | undefined) => {
  return await axios.put(`/recipes/${id}`, data);
};

// Define the EditRecipes component
const EditRecipes = () => {
  const { id } = useParams();

  // Initialize mutation for editing a recipe
  const editRecipeMutation = useMutation({
    mutationFn: (data: Recipe) => editRecipe(data, id)
  });

  // Fetch the details of the recipe to be edited using React Query
  const getRecipeDetail = useQuery({
    queryKey: ["recipeDetail", id],
    queryFn: () => fetchRecipeDetail(id)
  });

  const navigate = useNavigate(); // Hook for navigation

  // Redirect to the recipes list page when the mutation is successful
  useEffect(() => {
    if (editRecipeMutation.isSuccess) {
      navigate("/recipes", { replace: true });
    }
  }, [editRecipeMutation.isSuccess, navigate]);

  return (
    <div className="bg-white min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">EDIT RECIPE</h1>
          <button 
            onClick={() => navigate(`/recipes/${id}`)}
            className="bg-gray-800 text-white px-4 py-2 border-l-4 border-gray-600"
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              <span>BACK TO DETAILS</span>
            </div>
          </button>
        </div>

        {(editRecipeMutation.isPending || getRecipeDetail.isFetching) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg flex items-center">
              <svg className="animate-spin h-6 w-6 text-gray-800 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-lg font-medium text-gray-800">Updating recipe...</span>
            </div>
          </div>
        )}

        {getRecipeDetail.isFetching ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-24 bg-gray-200 animate-pulse rounded"></div>
            ))}
          </div>
        ) : (
          <RecipeForm
            isEdit={true}
            mutateFn={editRecipeMutation.mutate}
            defaultInputData={getRecipeDetail.data?.data}
          />
        )}
      </div>
    </div>
  );
};

export default EditRecipes;