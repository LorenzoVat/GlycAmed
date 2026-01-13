import { createContext, useContext, useEffect, useState } from "react";
import { useApi } from "~/hooks/useApi";

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
  refreshUser: () => void;
  logout: () => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<{ success: boolean; error?: string }>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const {
    data: user,
    loading,
    error,
    execute,
    setData,
    } = useApi<User>("/api/user/me", { credentials: "include" });

  const refreshUser = () => {
    if (!loading) execute();
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        await refreshUser();
        return { success: true };
      } else {
        return { success: false, error: data.error || data.message || "Erreur inconnue" };
      }
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      const response = await fetch("/api/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, firstName, lastName }),
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        await refreshUser();
        return { success: true };
      } else {
        return { success: false, error: data.error || data.message || "Erreur inconnue" };
      }
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/user/logout", { method: "POST", credentials: "include" });
      setData(null);
      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <UserContext.Provider value={{ user, loading, error, refreshUser, logout, login, register }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}