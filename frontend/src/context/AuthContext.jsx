import { createContext, useContext, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

const initialUser = JSON.parse(localStorage.getItem("user"));
const initialToken = localStorage.getItem("token");
const initialRefreshToken = localStorage.getItem("refreshToken");

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(initialUser);
  const [token, setToken] = useState(initialToken);
  const [refreshToken, setRefreshToken] = useState(initialRefreshToken);

  const login = (authData, userData) => {
    localStorage.setItem("token", authData.accessToken);
    localStorage.setItem("refreshToken", authData.refreshToken);
    localStorage.setItem("user", JSON.stringify(userData));

    setToken(authData.accessToken);
    setRefreshToken(authData.refreshToken);
    setUser(userData);
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      // ignore logout errors, still clear local state
    }

    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    setUser(null);
    setToken(null);
    setRefreshToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        refreshToken,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
