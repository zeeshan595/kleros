import * as ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { routes } from "./routes";
import { StrictMode } from "react";
import { ErrorContextProvider } from "./context/error.context";
import { LoadingContextProvider } from "./context/loading.context";
import "./main.css";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <ErrorContextProvider>
      <LoadingContextProvider>
        <RouterProvider router={routes} />
      </LoadingContextProvider>
    </ErrorContextProvider>
  </StrictMode>
);
