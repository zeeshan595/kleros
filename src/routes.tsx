import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/home";
import Game from "./pages/game";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/game/:contractAddress",
    element: <Game />,
  },
]);
