import { Textarea } from "@headlessui/react";
import { UseMutateFunction } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

// Define the props for the RecipeForm component
interface RecipeFormElementProps {
  isEdit: boolean;
  mutateFn: UseMutateFunction<any, Error, Recipe, unknown>;
  defaultInputData?: Recipe;
}

// Define the structure of the form fields
export type RecipeFormFields = {
    name: string;
    ingredients: string;
    instructions: string;
    prepTimeMinutes: number;
    cookTimeMinutes: number;
    servings: number;
    difficulty: string;
    cuisine: string;
    caloriesPerServing: number;
    tags: string;
    rating: number;
    mealType: string;
};

// Define the structure of a recipe
export type Recipe = {
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
    rating: number;
    mealType: string[];
};

// Function to convert an array of strings to a single string with each element on a new line
const ArrStringToTextLine = (arrString : string[]) => {
    let formattedString : string = "";
    for(let i = 0; i < arrString.length; i++){
        formattedString += arrString[i];
        if(i < arrString.length -1){
            formattedString += "\n";
        }
    }
    return formattedString;
}

// Function to convert a single string with newlines into an array of strings
const TextLineToArrString = (TextLine : string) => {
    const arrStrings : string[] = [];
    let temp : string = "";
    for(let i = 0; i < TextLine.length; i++){
        if(TextLine[i] === "\n" || i == TextLine.length -1){
          if(i == TextLine.length - 1) temp += TextLine[i];
            arrStrings.push(temp);
            temp = "";
        }else{
            temp += TextLine[i];
        }
    }
    return arrStrings;
};


// Function to reformat form fields into the Recipe structure
const reformatTextFieldToObject = (formData : RecipeFormFields) => {
    const reformatedDat : Recipe = {
        name : formData.name,
        ingredients : TextLineToArrString(formData.ingredients),
        instructions: TextLineToArrString(formData.instructions),
        prepTimeMinutes: formData.prepTimeMinutes,
        cookTimeMinutes: formData.cookTimeMinutes,
        servings: formData.servings,
        difficulty: formData.difficulty,
        cuisine: formData.cuisine,
        caloriesPerServing: formData.caloriesPerServing,
        tags: TextLineToArrString(formData.tags),
        rating: formData.rating,
        mealType: TextLineToArrString(formData.mealType)
    };

    return reformatedDat;
}

// Define the RecipeForm component
const RecipeForm: React.FC<RecipeFormElementProps> = (props) => {
    const{register, handleSubmit, setValue, formState: {errors}} = useForm<RecipeFormFields>();

    // Populate form fields with default data when in edit mode
    useEffect(() =>{
        if(props.defaultInputData){
            setValue("name", props.defaultInputData.name);
            setValue("ingredients", ArrStringToTextLine(props.defaultInputData.ingredients));
            setValue("instructions", ArrStringToTextLine(props.defaultInputData.instructions));
            setValue("prepTimeMinutes", props.defaultInputData.prepTimeMinutes);
            setValue("cookTimeMinutes", props.defaultInputData.cookTimeMinutes);
            setValue("servings", props.defaultInputData.servings);
            setValue("difficulty", props.defaultInputData.difficulty);
            setValue("cuisine", props.defaultInputData.cuisine);
            setValue("caloriesPerServing", props.defaultInputData.caloriesPerServing);
            setValue("tags", ArrStringToTextLine(props.defaultInputData.tags));
            setValue("rating", props.defaultInputData.rating);
            setValue("mealType", ArrStringToTextLine(props.defaultInputData.mealType));
        }
    }, [props.defaultInputData])

    // Handle form submission
    const onSubmit: SubmitHandler<RecipeFormFields> = (data) => {
        if (props.isEdit) {
            if (!confirm("Are you sure want to update recipe data ? ")) {
                return;
            }
        }

        const reformatedDat = reformatTextFieldToObject(data); // Reformat the data
        console.log(reformatedDat);
        props.mutateFn(reformatedDat); // Call the mutation function
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="name">
                        Recipe Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter recipe name"
                        {...register('name', { required: "Recipe name is required." })}
                    />
                    {errors.name && (
                        <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="difficulty">
                        Difficulty
                    </label>
                    <input
                        type="text"
                        id="difficulty"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Easy, Medium, Hard, etc."
                        {...register('difficulty', { required: "Difficulty is required." })}
                    />
                    {errors.difficulty && (
                        <p className="mt-2 text-sm text-red-600">{errors.difficulty.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="cuisine">
                        Cuisine
                    </label>
                    <input
                        type="text"
                        id="cuisine"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Italian, Mexican, etc."
                        {...register('cuisine', { required: "Cuisine is required." })}
                    />
                    {errors.cuisine && (
                        <p className="mt-2 text-sm text-red-600">{errors.cuisine.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="prepTimeMinutes">
                        Preparation Time (minutes)
                    </label>
                    <input
                        type="number"
                        id="prepTimeMinutes"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Prep time in minutes"
                        {...register('prepTimeMinutes', { required: "Preparation time is required." })}
                    />
                    {errors.prepTimeMinutes && (
                        <p className="mt-2 text-sm text-red-600">{errors.prepTimeMinutes.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="cookTimeMinutes">
                        Cooking Time (minutes)
                    </label>
                    <input
                        type="number"
                        id="cookTimeMinutes"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Cook time in minutes"
                        {...register('cookTimeMinutes', { required: "Cooking time is required." })}
                    />
                    {errors.cookTimeMinutes && (
                        <p className="mt-2 text-sm text-red-600">{errors.cookTimeMinutes.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="servings">
                        Servings
                    </label>
                    <input
                        type="number"
                        id="servings"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Number of servings"
                        {...register('servings', { required: "Servings amount is required." })}
                    />
                    {errors.servings && (
                        <p className="mt-2 text-sm text-red-600">{errors.servings.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="caloriesPerServing">
                        Calories Per Serving
                    </label>
                    <input
                        type="number"
                        id="caloriesPerServing"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Calories per serving"
                        {...register('caloriesPerServing', { required: "Calories per serving is required." })}
                    />
                    {errors.caloriesPerServing && (
                        <p className="mt-2 text-sm text-red-600">{errors.caloriesPerServing.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="rating">
                        Rating
                    </label>
                    <input
                        type="number"
                        id="rating"
                        step={0.1}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Rating (0-5)"
                        {...register('rating', { required: "Rating is required." })}
                    />
                    {errors.rating && (
                        <p className="mt-2 text-sm text-red-600">{errors.rating.message}</p>
                    )}
                </div>

                <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="ingredients">
                        Ingredients <span className="text-gray-500 text-xs">(one per line)</span>
                    </label>
                    <Textarea
                        id="ingredients"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 min-h-32"
                        placeholder="Enter ingredients (one per line)"
                        {...register('ingredients', { required: "Ingredients are required." })}
                    />
                    {errors.ingredients && (
                        <p className="mt-2 text-sm text-red-600">{errors.ingredients.message}</p>
                    )}
                    <p className="text-sm text-gray-500">
                        List each ingredient on a new line with measurements.
                    </p>
                </div>

                <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="instructions">
                        Instructions <span className="text-gray-500 text-xs">(one step per line)</span>
                    </label>
                    <Textarea
                        id="instructions"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 min-h-40"
                        placeholder="Enter cooking instructions (one step per line)"
                        {...register('instructions', { required: "Instructions are required." })}
                    />
                    {errors.instructions && (
                        <p className="mt-2 text-sm text-red-600">{errors.instructions.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="mealType">
                        Meal Type <span className="text-gray-500 text-xs">(one per line)</span>
                    </label>
                    <Textarea
                        id="mealType"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 min-h-24"
                        placeholder="Breakfast, Lunch, Dinner, etc."
                        {...register('mealType', { required: "Meal type is required." })}
                    />
                    {errors.mealType && (
                        <p className="mt-2 text-sm text-red-600">{errors.mealType.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="tags">
                        Tags <span className="text-gray-500 text-xs">(one per line)</span>
                    </label>
                    <Textarea
                        id="tags"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 min-h-24"
                        placeholder="Enter tags (one per line)"
                        {...register('tags', { required: "Tags are required." })}
                    />
                    {errors.tags && (
                        <p className="mt-2 text-sm text-red-600">{errors.tags.message}</p>
                    )}
                    <p className="text-sm text-gray-500">
                        Add keywords that describe your recipe (e.g., vegetarian, spicy, etc.)
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
                    {props.isEdit ? 'Update Recipe' : 'Create Recipe'}
                </button>
            </div>
        </form>
    );
};

export default RecipeForm; // Export the RecipeForm component