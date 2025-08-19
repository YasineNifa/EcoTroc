import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import AuthContextProvider from "./context/AuthContextProvider.jsx";
import { SnackbarProvider } from "notistack";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SnackbarProvider>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </SnackbarProvider>
  </StrictMode>
);
