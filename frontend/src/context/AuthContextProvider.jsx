import React, {
  useEffect,
  useMemo,
  useState,
  createContext,
  useCallback,
} from "react";
import apiClient from "../services/api";

export const AuthContext = createContext();

export default function AuthContextProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    console.log("AuthContext: Attempting to fetch user...");
    try {
      const response = await apiClient.get("/profile/me/");
      const userProfile = response.data;

      console.log("AuthContext: User fetch successful.", userProfile);
      setProfile(userProfile);
      setUser(userProfile.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.log(
        "AuthContext: User fetch failed. User is not authenticated.",
        error
      );
      setUser(null);
      setProfile(null);
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    console.log("AuthContext: Initializing authentication check...");
    const checkAuthStatus = async () => {
      setIsLoading(true);
      await fetchUser();
      setIsLoading(false);
      console.log("AuthContext: Authentication check finished.");
    };
    checkAuthStatus();
  }, [fetchUser]);

  const providerValue = useMemo(
    () => ({
      isAuthenticated,
      user,
      profile,
      isLoading,
      fetchUser,
      setIsAuthenticated,
      setUser,
      setProfile,
    }),
    [isAuthenticated, user, profile, isLoading, fetchUser]
  );

  return (
    <AuthContext.Provider value={providerValue}>
      {children}
    </AuthContext.Provider>
  );
}
