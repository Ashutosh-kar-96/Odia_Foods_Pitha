import { createContext, useContext, useMemo, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("pitha_token"));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("pitha_user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (payload) => {
    const { data } = await api.post("/auth/login", payload);
    localStorage.setItem("pitha_token", data.token);
    localStorage.setItem("pitha_user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const register = async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    localStorage.setItem("pitha_token", data.token);
    localStorage.setItem("pitha_user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("pitha_token");
    localStorage.removeItem("pitha_user");
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({ user, token, isAdmin: user?.role === "admin", login, register, logout }), [user, token]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
