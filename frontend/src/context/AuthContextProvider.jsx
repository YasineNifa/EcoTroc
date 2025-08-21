import React, { useEffect, useMemo, useState, createContext } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import getCommonOptions from "../helpers/axios/getCommonOptions";
import apiClient from "../services/api";

export const AuthContext = createContext({
  setIsAuthenticated: () => {},
  setUser: () => {},
  setProfile: () => {},
  isAuthenticated: null,
  user: null,
  profile: null,
});

export default function AuthContextProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadAuthUser = () => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      setIsAuthenticated(false);
      return;
    }
    axios
      .get("http://localhost:8000/api/auth/users/me/", getCommonOptions())
      .then((res) => {
        setUser(res.data);
        setIsAuthenticated(true);
      })
      .catch(() => {
        setIsAuthenticated(false);
      });
  };

  const loadAuthProfile = () => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      setIsAuthenticated(false);
      return;
    }
    axios
      .get("http://localhost:8000/api/profile/me/", getCommonOptions())
      .then((res) => {
        setProfile(res.data);
        setIsAuthenticated(true);
      })
      .catch(() => {
        setIsAuthenticated(false);
      });
  };

  const providerValue = useMemo(() => {
    return {
      setIsAuthenticated,
      setUser,
      setProfile,
      isAuthenticated,
      user,
      profile,
      isLoading,
    };
  }, [isAuthenticated, setIsAuthenticated, user, setUser, profile, setProfile]);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          apiClient.defaults.headers.common["Authorization"] = `Token ${token}`;
          const response = await apiClient.get("/auth/users/me/");
          setUser(response.data);
          setIsAuthenticated(true);
        } catch (error) {
          localStorage.removeItem("authToken");
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };
    checkAuthStatus();
  }, []);
  useEffect(() => {
    if (!user && (isAuthenticated === null || isAuthenticated === true)) {
      loadAuthUser();
      loadAuthProfile();
    }
  }, [user, isAuthenticated]);

  return (
    <AuthContext.Provider value={providerValue}>
      {children}
    </AuthContext.Provider>
  );
}

AuthContextProvider.propTypes = {
  children: PropTypes.node,
};
