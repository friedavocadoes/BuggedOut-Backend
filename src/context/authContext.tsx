"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUser, loginUser, logoutUser } from "@/lib/auth";

interface AuthContextType {
  user: any;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getUser();
      setUser(currentUser);
    };
    fetchUser();
  }, []);

  const login = async (username: string, password: string) => {
    const userData = await loginUser(username, password);
    if (userData) {
      setUser(userData);
      if (userData.role === "judge") {
        router.push("/judge-dashboard");
      } else {
        router.push("/team-dashboard");
      }
    }
  };

  const logout = () => {
    logoutUser();
    setUser(null);
    router.push("/auth/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
