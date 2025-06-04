"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  avatar?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (
    email: string,
    password: string,
    role: "user" | "admin"
  ) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Mock Data
const mockUsers: Record<"user" | "admin", User> = {
  user: {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "user",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
  },
  admin: {
    id: "2",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  },
};

// Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Auth Provider Component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for stored auth on mount
    const initializeAuth = () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser) as User;
          setUser(parsedUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Failed to parse stored user data:", error);
        localStorage.removeItem("user");
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (
    email: string,
    password: string,
    role: "user" | "admin"
  ): Promise<void> => {
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock login validation (in real app, this would be an API call)
      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      const mockUser = mockUsers[role];
      setUser(mockUser);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(mockUser));
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = (): void => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
