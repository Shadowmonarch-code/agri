"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  department?: string;
  year?: number;
  targetExams?: string[];
  coins: number;
  xp: number;
  streak: number;
  badges: number;
  joinedAt: Date;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  showLoginDialog: boolean;
  showRegisterDialog: boolean;
  showForgotPasswordDialog: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithOTP: (phone: string, otp: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (userData: Partial<User> & { password: string }) => Promise<void>;
  logout: () => void;
  openLoginDialog: () => void;
  closeLoginDialog: () => void;
  openRegisterDialog: () => void;
  closeRegisterDialog: () => void;
  openForgotPasswordDialog: () => void;
  closeForgotPasswordDialog: () => void;
  switchToRegister: () => void;
  switchToLogin: () => void;
  switchToForgotPassword: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simulated user data for demo
const DEMO_USER: User = {
  id: "usr_001",
  name: "Rahul Kumar",
  email: "rahul.kumar@example.com",
  avatar: undefined,
  department: "agriculture",
  year: 3,
  targetExams: ["icar-jrf", "aieea"],
  coins: 1250,
  xp: 4500,
  streak: 7,
  badges: 5,
  joinedAt: new Date("2024-01-15"),
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showRegisterDialog, setShowRegisterDialog] = useState(false);
  const [showForgotPasswordDialog, setShowForgotPasswordDialog] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Simulate checking stored auth token
        if (typeof window !== "undefined") {
          const storedUser = localStorage.getItem("agriverse_user");
          const token = localStorage.getItem("agriverse_token");
          
          if (storedUser && token) {
            setUser(JSON.parse(storedUser));
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Auth actions
  const login = useCallback(async (email: string, _password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Demo: accept any email/password combination
      const loggedInUser: User = {
        ...DEMO_USER,
        email,
        name: email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      };
      
      setUser(loggedInUser);
      
      if (typeof window !== "undefined") {
        localStorage.setItem("agriverse_user", JSON.stringify(loggedInUser));
        localStorage.setItem("agriverse_token", "demo_token_" + Date.now());
      }
      
      setShowLoginDialog(false);
    } catch (error) {
      throw new Error("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginWithOTP = useCallback(async (phone: string, _otp: string) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      const loggedInUser: User = {
        ...DEMO_USER,
        email: `${phone}@agriverse.demo`,
        name: "Phone User",
      };
      
      setUser(loggedInUser);
      
      if (typeof window !== "undefined") {
        localStorage.setItem("agriverse_user", JSON.stringify(loggedInUser));
        localStorage.setItem("agriverse_token", "demo_token_" + Date.now());
      }
      
      setShowLoginDialog(false);
    } catch (error) {
      throw new Error("Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginWithGoogle = useCallback(async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      const googleUser: User = {
        ...DEMO_USER,
        email: "google.user@gmail.com",
        name: "Google User",
      };
      
      setUser(googleUser);
      
      if (typeof window !== "undefined") {
        localStorage.setItem("agriverse_user", JSON.stringify(googleUser));
        localStorage.setItem("agriverse_token", "google_token_" + Date.now());
      }
      
      setShowLoginDialog(false);
    } catch (error) {
      throw new Error("Google sign-in failed");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (userData: Partial<User> & { password: string }) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      const newUser: User = {
        id: "usr_" + Date.now(),
        name: userData.name || "New User",
        email: userData.email || "",
        department: userData.department,
        year: userData.year,
        targetExams: userData.targetExams,
        coins: 100, // Welcome bonus
        xp: 0,
        streak: 0,
        badges: 1, // Welcome badge
        joinedAt: new Date(),
      };
      
      setUser(newUser);
      
      if (typeof window !== "undefined") {
        localStorage.setItem("agriverse_user", JSON.stringify(newUser));
        localStorage.setItem("agriverse_token", "new_token_" + Date.now());
      }
      
      setShowRegisterDialog(false);
    } catch (error) {
      throw new Error("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    
    if (typeof window !== "undefined") {
      localStorage.removeItem("agriverse_user");
      localStorage.removeItem("agriverse_token");
    }
  }, []);

  const updateProfile = useCallback(async (data: Partial<User>) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setUser((prev) => {
        if (!prev) return null;
        const updated = { ...prev, ...data };
        
        if (typeof window !== "undefined") {
          localStorage.setItem("agriverse_user", JSON.stringify(updated));
        }
        
        return updated;
      });
    } catch (error) {
      throw new Error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Dialog controls
  const openLoginDialog = useCallback(() => {
    setShowLoginDialog(true);
    setShowRegisterDialog(false);
    setShowForgotPasswordDialog(false);
  }, []);

  const closeLoginDialog = useCallback(() => {
    setShowLoginDialog(false);
  }, []);

  const openRegisterDialog = useCallback(() => {
    setShowRegisterDialog(true);
    setShowLoginDialog(false);
    setShowForgotPasswordDialog(false);
  }, []);

  const closeRegisterDialog = useCallback(() => {
    setShowRegisterDialog(false);
  }, []);

  const openForgotPasswordDialog = useCallback(() => {
    setShowForgotPasswordDialog(true);
    setShowLoginDialog(false);
    setShowRegisterDialog(false);
  }, []);

  const closeForgotPasswordDialog = useCallback(() => {
    setShowForgotPasswordDialog(false);
  }, []);

  const switchToRegister = useCallback(() => {
    setShowLoginDialog(false);
    setShowRegisterDialog(true);
  }, []);

  const switchToLogin = useCallback(() => {
    setShowRegisterDialog(false);
    setShowForgotPasswordDialog(false);
    setShowLoginDialog(true);
  }, []);

  const switchToForgotPassword = useCallback(() => {
    setShowLoginDialog(false);
    setShowForgotPasswordDialog(true);
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    showLoginDialog,
    showRegisterDialog,
    showForgotPasswordDialog,
    login,
    loginWithOTP,
    loginWithGoogle,
    register,
    logout,
    openLoginDialog,
    closeLoginDialog,
    openRegisterDialog,
    closeRegisterDialog,
    openForgotPasswordDialog,
    closeForgotPasswordDialog,
    switchToRegister,
    switchToLogin,
    switchToForgotPassword,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
