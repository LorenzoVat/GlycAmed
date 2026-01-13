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
  refreshUser: () => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const {
    data: user,
    loading,
    execute,
    setData,
  } = useApi<User>("/api/user/me", {
    immediate: true,
  });

  const refreshUser = () => {
    execute();
  };

  const logout = async () => {
    try {
      await fetch("/api/user/logout", { method: "POST" });
      setData(null);
      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <UserContext.Provider value={{ user, loading, refreshUser, logout }}>
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