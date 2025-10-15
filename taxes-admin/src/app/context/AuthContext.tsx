"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { login as apiLogin } from "@/lib/api";

interface User {
  id: number;
  prenom: string;
  nom: string;
  role: "admin" | "tresorier" | "agent" | "conducteur";
  access_token: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Ne s'exécute que côté client
    const savedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null;
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Error parsing saved user:", error);
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const data = await apiLogin(email, password);

      const userData: User = {
        id: data.user_id,
        prenom: data.prenom,
        nom: data.nom,
        role: data.role,
        access_token: data.access_token,
      };

      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      if (data.role === "admin") router.push("/dashboard/admin");
      else if (data.role === "tresorier") router.push("/dashboard/tresorier");
      else router.push("/login");
    } catch (err: any) {
      throw new Error(err.response?.data?.detail || "Erreur de connexion");
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};