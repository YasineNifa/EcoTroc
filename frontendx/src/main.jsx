import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { SnackbarProvider } from "notistack";
import AuthContextProvider from "./context/AuthContextProvider.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthContextProvider>
      <ThemeProvider>
        <SnackbarProvider>
          <App />
        </SnackbarProvider>
      </ThemeProvider>
    </AuthContextProvider>
  </StrictMode>
);
