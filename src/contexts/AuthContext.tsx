/**
 * =============================================
 * Authentication Context
 * Manages user login state and role-based access
 * Replace with actual PHP session/JWT auth later
 * =============================================
 */

import React, { createContext, useContext, useState, useCallback } from "react";
import { User, UserRole } from "@/types";
import { mockUsers } from "@/data/mockData";

/** Auth context shape */
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

/** Auth provider wraps the app */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  /**
   * Dummy login — matches email against mock users
   * Password is ignored (any password works)
   * TODO: Replace with actual PHP API call
   */
  const login = useCallback((email: string, _password: string): boolean => {
    const found = mockUsers.find((u) => u.email === email);
    if (found) {
      setUser(found);
      return true;
    }
    return false;
  }, []);

  /** Logout — clear user state */
  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

/** Hook to access auth context */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
