
import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "../models/Property";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, name: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user in localStorage
    const storedUser = localStorage.getItem("rentnest_user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("rentnest_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // For admin login
      if (email === "admin@rentnest.com" && password === "admin123") {
        const adminUser: User = {
          id: "admin-user",
          email: "admin@rentnest.com",
          name: "Admin User",
          role: "admin",
        };
        setUser(adminUser);
        localStorage.setItem("rentnest_user", JSON.stringify(adminUser));
        toast.success("Welcome back, Admin!");
        return true;
      }

      // For demo users - in real app, this would be an API call
      if (email && password) {
        const newUser: User = {
          id: `user-${Date.now()}`,
          email,
          name: email.split("@")[0],
          role: "user",
        };
        setUser(newUser);
        localStorage.setItem("rentnest_user", JSON.stringify(newUser));
        toast.success("Login successful!");
        return true;
      }
      
      toast.error("Invalid email or password");
      return false;
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, name: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (email === "admin@rentnest.com") {
        toast.error("This email is reserved. Please use another email.");
        return false;
      }

      const newUser: User = {
        id: `user-${Date.now()}`,
        email,
        name,
        role: "user",
      };
      
      setUser(newUser);
      localStorage.setItem("rentnest_user", JSON.stringify(newUser));
      toast.success("Account created successfully!");
      return true;
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Signup failed. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("rentnest_user");
    toast.success("Logged out successfully");
  };

  const value = {
    user,
    isLoading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
