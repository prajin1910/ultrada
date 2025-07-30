import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { User } from "../types";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  refreshAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      if (sessionChecked) return;
      
      try {
        const savedToken = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");


        if (savedToken && savedUser) {
          // Set token in axios headers
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${savedToken}`;
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
        }
        setSessionChecked(true);
      } catch (error) {
        console.error("Auth initialization error:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setSessionChecked(true);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [sessionChecked]);

  const refreshAuth = () => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    
    if (savedToken && savedUser && (!token || !user)) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      axios.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
    }
  };
  const login = (userData: User, authToken: string) => {
    console.log("Login successful, setting user data");
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("token", authToken);
    localStorage.setItem("user", JSON.stringify(userData));
    axios.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;
  };

  const logout = () => {
    console.log("Logout initiated");
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token && !!user,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
