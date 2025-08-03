"use client";
import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "@/i18n/navigation";

type Role = "super_admin" | "restaurant_admin" | "staff";

interface User {
  id: string;
  role: Role | null;
  permissions?: string[];
  restaurant_id?: string | null;
  branch_id?: string | null;
}

interface AuthContextValue {
  isAuthenticated: boolean;
  user: User | null;
  login: (data: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = Cookies.get("auth");
    if (stored) {
      try {
        const userData = JSON.parse(stored);
        setUser(userData);
      } catch (error) {
        console.error("Failed to parse auth cookie:", error);
        Cookies.remove("auth");
        setUser(null);
      }
    }
  }, []);

  const login = (data: User) => {
    Cookies.set("auth", JSON.stringify(data), { secure: true });
    setUser(data);
    router.push("/dashboard");
  };

  const logout = () => {
    Cookies.remove("auth");
    setUser(null);
    router.push("/login");
  };

  const value: AuthContextValue = {
    isAuthenticated: !!user,
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be inside AuthProvider");
  return context;
};
