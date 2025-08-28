import { useCallback, useState, useContext } from "react";
import apiClient from "../services/api";
import { useSnackbar } from "notistack";

import formatHttpApiError from "../helpers/formatHttpApiError";
import { AuthContext } from "../context/AuthContextProvider";

export default function useRequestAuth() {
  const [loading, setLoading] = useState(false);
  const [logoutPending, setLogoutPending] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [error, setError] = useState(null);
  
  // --- UPDATE: Get fetchUser from the context ---
  const { setIsAuthenticated, setUser, fetchUser } = useContext(AuthContext);

  const handleRequestError = useCallback(
    (err) => {
      const formattedError = formatHttpApiError(err);
      setError(formattedError);
      enqueueSnackbar(formattedError);
      setLoading(false);
    },
    [enqueueSnackbar, setLoading, setError]
  );

  // No changes needed for register
  const register = useCallback(
    ({ username, email, password }, successCallback) => {
      setLoading(true);
      apiClient
        .post("/auth/users/", {
          username,
          email,
          password,
        })
        .then(() => {
          enqueueSnackbar(
            "Sign up is successful, you can now sign in with your credentials"
          );
          setLoading(false);
          if (successCallback) {
            successCallback();
          }
        })
        .catch(handleRequestError);
    },
    [enqueueSnackbar, handleRequestError, setLoading]
  );

  // --- UPDATED LOGIN FUNCTION ---
  const login = useCallback(
    ({ username, password }, successCallback) => {
      setLoading(true);
      apiClient
        .post("/token/", { username, password }) // Use the new cookie-based endpoint
        .then(() => {
          // On success, the cookie is set. Now, fetch the user data to update the app's state.
          fetchUser().then(() => {
            setLoading(false);
            if (successCallback) {
              successCallback();
            }
          });
        })
        .catch(handleRequestError);
    },
    [handleRequestError, setLoading, fetchUser]
  );

  // --- UPDATED LOGOUT FUNCTION ---
  const logout = useCallback(() => {
    setLogoutPending(true);
    apiClient
      .post("/logout/") // Use the new cookie-based logout endpoint
      .then(() => {
        // On success, the backend has cleared the cookie. Now, clear the frontend state.
        setLogoutPending(false);
        setUser(null);
        setIsAuthenticated(false);
      })
      .catch((err) => {
        setLogoutPending(false);
        handleRequestError(err);
      });
  }, [handleRequestError, setLogoutPending, setIsAuthenticated, setUser]);

  // No changes needed for password reset functions
  const requestResetPassword = useCallback(/* ... */);
  const resetPassword = useCallback(/* ... */);

  return {
    register,
    login,
    logout,
    logoutPending,
    loading,
    error,
    requestResetPassword,
    resetPassword,
  };
}
