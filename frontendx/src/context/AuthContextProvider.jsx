import React, { useEffect, useMemo, useState, createContext } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import getCommonOptions from "../helpers/axios/gtCommonOptions";

export const AuthContext = createContext({
  isAuthenticated: null,
  setIsAuthenticated: () => {},
  user: null,
  setUser: () => {},
  setProfile: () => {},
  profile: null,
});

export default function AuthContextProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

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
      isAuthenticated,
      setIsAuthenticated,
      user,
      setUser,
      setProfile,
      profile,
    };
  }, [isAuthenticated, setIsAuthenticated, user, setUser]);

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
