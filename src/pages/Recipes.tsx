import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "../utils/AxiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

// Define the structure of a single recipe
interface Recipe {
  id: number;
  name: string;
  difficulty: string;
  image: string;
  rating: number;
}

// Define the structure of the response containing multiple recipes
interface RecipesList {
  recipes: Recipe[];
}

// Component to display a single recipe card
const RecipeCard: React.FC<Recipe> = (recipe: Recipe) => {
  return (
    <div className="bg-white border-l-4 border-gray-600 mb-6">
      <div className="p-6">
        <div className="flex items-start gap-4">
          {/* Recipe Image */}
          <div className="h-24 w-24 flex-shrink-0 overflow-hidden">
            <img
              alt={recipe.name}
              src={recipe.image}
              className="h-full w-full object-cover"
            />
          </div>
          
          {/* Recipe Info */}
          <div className="flex-1">
            <h3 className="font-medium text-lg text-gray-800">{recipe.name}</h3>
            
            <div className="flex items-center mt-2 text-gray-500">
              <span className="flex items-center mr-4">
                <svg className="w-5 h-5 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-mono">{recipe.rating}</span>
              </span>
              
              <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                {recipe.difficulty}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Function to fetch the list of recipes from the API
const fetchRecipesList = async () => {
  return await axios.get<RecipesList>("/recipes");
};

// Component to display a skeleton loader while recipes are being fetched
const RecipesSkeleton = () => {
  return (
    <div className="bg-white border-l-4 border-gray-300 mb-6">
      <div className="p-6">
        <div className="flex items-start gap-4">
          {/* Image Skeleton */}
          <div className="h-24 w-24 bg-gray-200 animate-pulse"></div>
          
          {/* Info Skeleton */}
          <div className="flex-1">
            <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4 mb-2"></div>
            
            <div className="flex items-center mt-2">
              <div className="flex items-center mr-4">
                <div className="w-5 h-5 bg-gray-200 rounded-full animate-pulse mr-1"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-8"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded-full animate-pulse w-16"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Recipes component
const Recipes = () => {
  const getRecipesList = useQuery({ queryKey: ["recipeList"], queryFn: fetchRecipesList });
  const navigate = useNavigate();

  return (
    <div className="bg-white min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">RECIPES</h1>
          <button 
            onClick={() => navigate("/recipes/add")}
            className="bg-gray-800 text-white px-4 py-2 border-l-4 border-gray-600"
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
              </svg>
              <span>NEW RECIPE</span>
            </div>
          </button>
        </div>

        <div className="space-y-0">
          {getRecipesList.isFetching ? (
            Array.from({ length: 5 }).map((_, index) => <RecipesSkeleton key={index} />)
          ) : (
            getRecipesList.data?.data.recipes.map((recipe) => (
              <div
                key={recipe.id}
                className="cursor-pointer"
                onClick={() => navigate(`/recipes/${recipe.id}`)}
              >
                <RecipeCard {...recipe} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

interface RecipeDetails {
  id: number;
  name: string;
  ingredients: string[];
  instructions: string[];
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: string;
  cuisine: string;
  caloriesPerServing: number;
  tags: string[];
  userId: number;
  image: string;
  rating: number;
  mealType: string[];
}

// Define the structure of a deleted recipe
interface DeletedRecipe extends RecipeDetails {
  isDeleted: Boolean;
  deletedOn: string;
}

// Function to fetch the details of a specific recipe by its ID
export const fetchRecipeDetail = async (id: string | undefined) => {
  return await axios.get<RecipeDetails>(`/recipes/${id}`);
};

// Function to delete a recipe by its ID
const deleteRecipe = async (id: string | undefined) => {
  return await axios.delete<DeletedRecipe>(`recipes/${id}`);
};

// Component to display a skeleton loader while recipe details are being fetched
const RecipeDetailSkeleton = () => {
  return (
    <div className="bg-white border-l-4 border-gray-300 p-6 animate-pulse">
      <div className="flex flex-col gap-6">
        {/* Header Skeleton */}
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-gray-200 animate-pulse h-12 w-12 rounded"></div>
          <div className="flex-1">
            <div className="bg-gray-200 animate-pulse h-5 w-32 rounded mb-2"></div>
            <div className="bg-gray-200 animate-pulse h-3 w-24 rounded"></div>
          </div>
        </div>
        
        {/* Image Skeleton */}
        <div className="bg-gray-200 animate-pulse h-48 w-full rounded"></div>
        
        {/* Details Skeleton */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-200 animate-pulse h-8 rounded"></div>
          <div className="bg-gray-200 animate-pulse h-8 rounded"></div>
          <div className="bg-gray-200 animate-pulse h-8 rounded"></div>
          <div className="bg-gray-200 animate-pulse h-8 rounded"></div>
        </div>
        
        {/* Ingredients Skeleton */}
        <div>
          <div className="bg-gray-200 animate-pulse h-5 w-32 rounded mb-2"></div>
          <div className="space-y-2">
            <div className="bg-gray-200 animate-pulse h-4 rounded"></div>
            <div className="bg-gray-200 animate-pulse h-4 rounded"></div>
            <div className="bg-gray-200 animate-pulse h-4 rounded"></div>
          </div>
        </div>
        
        {/* Instructions Skeleton */}
        <div>
          <div className="bg-gray-200 animate-pulse h-5 w-32 rounded mb-2"></div>
          <div className="space-y-2">
            <div className="bg-gray-200 animate-pulse h-4 rounded"></div>
            <div className="bg-gray-200 animate-pulse h-4 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Component to display the recipe details
const RecipeContent: React.FC<RecipeDetails> = (recipe: RecipeDetails) => {
  return (
    <div className="bg-white border-l-4 border-gray-600 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-shrink-0">
          <div className="h-12 w-12 bg-gray-800 flex items-center justify-center text-white rounded">
            <span className="font-mono">{recipe.name.charAt(0)}</span>
          </div>
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-medium text-gray-800">{recipe.name}</h1>
          <p className="text-sm text-gray-500 font-mono">
            {recipe.cuisine} | {recipe.difficulty}
          </p>
        </div>
        <div className="flex items-center text-yellow-500">
          <svg className="w-5 h-5 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="font-mono">{recipe.rating}</span>
        </div>
      </div>

      {/* Recipe Image */}
      <div className="mb-6">
        <img
          src={recipe.image}
          alt={recipe.name}
          className="w-full h-64 object-cover border border-gray-200"
        />
      </div>

      {/* Recipe Details */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="border-l-2 border-gray-300 pl-3">
          <p className="font-semibold">Prep Time:</p>
          <p className="text-gray-700">{recipe.prepTimeMinutes} mins</p>
        </div>
        <div className="border-l-2 border-gray-300 pl-3">
          <p className="font-semibold">Cook Time:</p>
          <p className="text-gray-700">{recipe.cookTimeMinutes} mins</p>
        </div>
        <div className="border-l-2 border-gray-300 pl-3">
          <p className="font-semibold">Servings:</p>
          <p className="text-gray-700">{recipe.servings}</p>
        </div>
        <div className="border-l-2 border-gray-300 pl-3">
          <p className="font-semibold">Calories:</p>
          <p className="text-gray-700">{recipe.caloriesPerServing} per serving</p>
        </div>
      </div>

      {/* Tags */}
      <div className="mb-6">
        <p className="font-semibold mb-2">Tags:</p>
        <div className="flex flex-wrap gap-2">
          {recipe.tags.map((tag) => (
            <span
              key={tag}
              className="bg-gray-100 rounded-full px-3 py-1 text-sm font-medium text-gray-700"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Meal Type */}
      <div className="mb-6">
        <p className="font-semibold mb-2">Meal Type:</p>
        <div className="flex flex-wrap gap-2">
          {recipe.mealType.map((type) => (
            <span
              key={type}
              className="bg-gray-100 rounded-full px-3 py-1 text-sm font-medium text-gray-700"
            >
              {type}
            </span>
          ))}
        </div>
      </div>

      {/* Ingredients */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Ingredients</h2>
        <ul className="pl-3 border-l-2 border-gray-300 text-gray-700 space-y-2">
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index} className="flex items-center">
              <span className="w-4 h-4 bg-gray-800 rounded-full mr-2 flex-shrink-0"></span>
              {ingredient}
            </li>
          ))}
        </ul>
      </div>

      {/* Instructions */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Instructions</h2>
        <ol className="space-y-4">
          {recipe.instructions.map((instruction, index) => (
            <li key={index} className="pl-3 border-l-2 border-gray-300">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1 flex items-center justify-center h-6 w-6 bg-gray-800 text-white rounded mr-2">
                  <span className="text-sm">{index + 1}</span>
                </div>
                <p className="text-gray-700">{instruction}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

// Main Recipe Details component
const RecipeDetails = () => {
  const { id } = useParams();

  // Fetch the recipe details using React Query
  const getRecipeDetails = useQuery({
    queryKey: ["recipeDetail", id],
    queryFn: () => fetchRecipeDetail(id),
  });

  // Initialize mutation for deleting the recipe
  const deleteRecipeMutation = useMutation({
    mutationFn: () => deleteRecipe(id),
  });

  const recipe: RecipeDetails | undefined = getRecipeDetails.data?.data; // Extract recipe data

  const navigate = useNavigate(); // Hook for navigation

  // Redirect to the recipes list page when the recipe is successfully deleted
  useEffect(() => {
    if (deleteRecipeMutation.isSuccess) {
      navigate("/recipes", { replace: true });
    }
  }, [deleteRecipeMutation.isSuccess, navigate]);

  return (
    <div className="bg-white min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">RECIPE DETAILS</h1>
          <button 
            onClick={() => navigate("/recipes")}
            className="bg-gray-800 text-white px-4 py-2 border-l-4 border-gray-600"
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              <span>BACK TO RECIPES</span>
            </div>
          </button>
        </div>

        {getRecipeDetails.isFetching || recipe === undefined ? (
          <RecipeDetailSkeleton />
        ) : (
          <>
            <RecipeContent {...recipe} />
            
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => navigate(`/recipes/${id}/edit`)}
                className="flex items-center px-4 py-2 bg-gray-800 text-white border-l-4 border-gray-600"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
                EDIT
              </button>
              
              <button
                onClick={() => {
                  if (confirm("Are you sure you want to delete this recipe?")) {
                    deleteRecipeMutation.mutate();
                  }
                }}
                className="flex items-center px-4 py-2 bg-red-600 text-white border-l-4 border-red-800"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
                DELETE
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Recipes;