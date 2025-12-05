import React, { createContext, useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

type AuthContextType = {
  isAuthenticated: boolean;
  userEmail: string | null;
  login: (email?: string | null) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem("isAuthenticated") === "true";
    } catch {
      return false;
    }
  });

  const [userEmail, setUserEmail] = useState<string | null>(() => {
    try {
      return localStorage.getItem("auth_user") || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (isAuthenticated) localStorage.setItem("isAuthenticated", "true");
      else localStorage.removeItem("isAuthenticated");

      if (userEmail) localStorage.setItem("auth_user", userEmail);
      else localStorage.removeItem("auth_user");
    } catch {}
  }, [isAuthenticated, userEmail]);

  const login = (email?: string | null) => {
    setIsAuthenticated(true);
    setUserEmail(email ?? null);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserEmail(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userEmail, login, logout }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const RequireAuth: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
};
