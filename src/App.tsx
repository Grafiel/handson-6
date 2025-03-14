import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import Carts from "./pages/Carts";
import Post from "./pages/Post";
import Product from "./pages/Product";
import Recipes from "./pages/Recipes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import AddProduct from "./pages/AddProduct";
import Comments from "./pages/Comments";
import Todos from "./pages/Todos";
import AddPost from "./pages/AddPost";
import EditPost from "./pages/EditPost";
import AddComments from "./pages/AddComments";
import EditComments from "./pages/EditComments";
import AddTodos from "./pages/AddTodos";
import EditTodos from "./pages/EditTodos";
import AddRecipes from "./pages/AddRecipes";
import EditRecipes from "./pages/EditRecipes";
  
  const queryClient = new QueryClient();
  
  function App() {
	const router = createBrowserRouter(
	  createRoutesFromElements(
		<Route path="/" element={<RootLayout />}>
		  <Route index element={<Home/>}/>
		  <Route path="product" element={<Product />} />
		  <Route path="product/add" element={<AddProduct />}/>
		  <Route path="product/:id" element={<ProductDetail />} />	
		  <Route path="recipes" element={<Recipes />} />
		  <Route path="recipes/add" element={<AddRecipes />}/>
		  <Route path="recipes/:id/edit" element={<EditRecipes/>}/>
		  <Route path="comments" element={<Comments />} />
		  <Route path="comments/add" element={<AddComments />}/>
		  <Route path="comments/:id/edit" element={<EditComments/>}/>
		  <Route path="posts" element={<Post />} />
		  <Route path="posts/add" element={<AddPost />}/>
		  <Route path="posts/:id/edit" element={<EditPost/>}/>
		  <Route path="todos" element={<Todos />} />
		  <Route path="todos/add" element={<AddTodos />}/>
		  <Route path="todos/:id/edit" element={<EditTodos/>}/>
		  <Route path="carts" element={<Carts />} />
		</Route>
	  )
	);
	return (
	  <>
		<QueryClientProvider client={queryClient}>
		  <RouterProvider router={router} />
		</QueryClientProvider>
	  </>
	);
  }
  
  export default App;
  