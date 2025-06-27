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
    const initializeAuth = async () => {
      // Check for stored user and token in localStorage
      const storedUser = localStorage.getItem("rentnest_user");
      const storedToken = localStorage.getItem("rentnest_token");

      if (storedUser && storedToken) {
        try {
          const parsedUser = JSON.parse(storedUser);

          // Validate token by fetching user profile
          const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
          const profileRes = await fetch(`${API_BASE}/user/profile`, {
            headers: { Authorization: `Bearer ${storedToken}` }
          });

          if (profileRes.ok) {
            const profile = await profileRes.json();
            // Update user with latest profile data
            const updatedUser = {
              id: profile._id || profile.id,
              email: profile.email || parsedUser.email,
              name: profile.name || parsedUser.name,
              role: profile.role || parsedUser.role
            };
            setUser(updatedUser);
            localStorage.setItem("rentnest_user", JSON.stringify(updatedUser));
          } else {
            // Token is invalid, clear storage
            localStorage.removeItem("rentnest_user");
            localStorage.removeItem("rentnest_token");
            toast.error("Your session has expired. Please log in again.");
          }
        } catch (error) {
          console.error("Error initializing auth:", error);
          localStorage.removeItem("rentnest_user");
          localStorage.removeItem("rentnest_token");
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Allow hardcoded admin login
      // if (email === "admin@admin.com" && password === "admin12345") {
      //   const adminUser: User = {
      //     id: "admin-user",
      //     email: "admin@admin.com",
      //     name: "Admin User",
      //     role: "admin",
      //   };
      //   setUser(adminUser);
      //   localStorage.setItem("rentnest_user", JSON.stringify(adminUser));
      //   toast.success("Welcome back, Admin!");
      //   setIsLoading(false);
      //   return true;
      // }

      // Backend login
      const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem("rentnest_token", data.token);
        // Fetch user profile
        const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
        const profileRes = await fetch(`${API_BASE}/user/profile`, {
          headers: { Authorization: `Bearer ${data.token}` }
        });
        const profile = await profileRes.json();
        const userData = {
          id: profile._id || profile.id,
          email: profile.email || email,
          name: profile.name || email.split("@")[0],
          role: profile.role || "user" // <-- This should be "admin" if backend returns it
        };
        setUser(userData);
        localStorage.setItem("rentnest_user", JSON.stringify(userData));
        toast.success("Login successful!");
        return true;
      } else {
        toast.error(data.message || "Invalid email or password");
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      console.log(error)
      toast.error("Login failed. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, name: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Prevent registration of admin email
      // if (email === "admin@admin.com") {
      //   toast.error("This email is reserved for admin. Please use another email.");
      //   setIsLoading(false);
      //   return false;
      // }

      const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, password, role: "user" })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Account created successfully! Please log in.");
        return true;
      } else {
        toast.error(data.message || "Signup failed");
        return false;
      }
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
    localStorage.removeItem("rentnest_token");
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
