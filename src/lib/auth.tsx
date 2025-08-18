"use client";
import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "@/i18n/navigation";
import { AdminLoginData, BackendAdminLoginResponse } from "@/types";

type Role = "super_admin" | "restaurant_admin" | "staff" | "customer" | "other";

interface User {
  id: string;
  full_name?: string;
  email?: string | null;
  phone_number?: string | null;
  profile_picture?: string | null;
  role_tag?: string | null;
  role_name?: string | null;
  permissions?: string[];
  restaurant_id?: string | null;
  branch_id?: string | null;
  requiresPasswordChange?: boolean;
}

interface AuthContextValue {
  isAuthenticated: boolean;
  user: User | null;
  login: (response: {
    success: boolean;
    data: BackendAdminLoginResponse;
    requiresPasswordChange?: boolean;
    token: string;
  }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
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

  useEffect(() => {
    if (isLoggingIn && user) {
      if (user.requiresPasswordChange) {
        router.push("/change-password");
      } else {
        router.push("/dashboard");
      }
      setIsLoggingIn(false);
    }
  }, [user, isLoggingIn, router]);

  const login = (response: {
    success: boolean;
    data: BackendAdminLoginResponse;
    requiresPasswordChange?: boolean;
    token: string;
  }) => {
    const adminLoginData: AdminLoginData = response.data.data;

    console.log(adminLoginData, "Admin Data");
    const requiresPasswordChangeFromApi =
      response.requiresPasswordChange || false;

    let userData: User;
    if (requiresPasswordChangeFromApi) {
      console.log("Apple - Requires Password Change");
      userData = {
        id: adminLoginData.id, // Use id from adminLoginData
        role_tag: null,
        role_name: null, // Role is not fully set until password is changed
        permissions: [], // No permissions until password is changed
        restaurant_id: null,
        branch_id: null,
        requiresPasswordChange: true,
      };
    } else {
      console.log("Mango - Standard Login");
      console.log("Admin Login Data", adminLoginData);
      userData = {
        id: adminLoginData.id,
        full_name: adminLoginData.full_name,
        email: adminLoginData.email,
        phone_number: adminLoginData.phone_number,
        profile_picture: adminLoginData.profile_picture,
        role_name: adminLoginData.role_name,
        role_tag: adminLoginData.role_tag as Role,
        permissions: adminLoginData.permissions,
        restaurant_id: adminLoginData.restaurant_id,
        branch_id: adminLoginData.branch_id,
        requiresPasswordChange: false,
      };
    }

    Cookies.set("auth", JSON.stringify(userData), { secure: true, expires: 7 });
    Cookies.set("token", response?.token, {
      secure: true,
      expires: 7,
    });
    setUser(userData);

    setIsLoggingIn(true);
  };

  const logout = () => {
    Cookies.remove("auth");
    Cookies.remove("token");
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
