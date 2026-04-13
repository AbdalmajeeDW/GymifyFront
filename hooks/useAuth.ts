"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const savedToken = localStorage.getItem("auth-token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      setToken(savedToken);

      setUser(JSON.parse(savedUser));

      if (window.location.pathname === "/login") {
        router.push("/");
      }
    }

    setIsLoading(false);
  };

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://gymifyback.onrender.com/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        },
      );

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();

      localStorage.setItem("auth-token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setToken(data.access_token);
      setUser(data.user);

      router.push("/");
    } catch (error) {
      localStorage.removeItem("auth-token");
      localStorage.removeItem("user");
      setToken(null);
      setUser(null);

      throw new Error("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("auth-token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const isAuthenticated = (): boolean => {
    return !!token;
  };

  return {
    user,
    token,
    login,
    logout,
    isLoading,
    isAuthenticated,
  };
};
