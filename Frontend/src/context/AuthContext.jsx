import React, { createContext, useState } from "react";

export const AuthContext = createContext();

function AuthProvider({ children }) {
  const serverUrl = "http://localhost:5000";

  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);

  const login = (token) => {
    localStorage.setItem("token", token);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
  };

  const value = {
    serverUrl,
    loading,
    setLoading,
    token,
    setToken,
    user,
    setUser,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;