import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/home";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
]);
