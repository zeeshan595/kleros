import * as ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { routes } from "./routes";
import { StrictMode } from "react";
import "./main.css";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <RouterProvider router={routes} />
  </StrictMode>
);
