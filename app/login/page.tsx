"use client";

import { useEffect, useState } from "react";
import LoginForm from "@/components/LoginForm";
import { useAuth } from "@/hooks/useAuth";

export default function LoginClient() {
  const { isAuthenticated, isLoading } = useAuth();

  const [returnUrl, setReturnUrl] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setReturnUrl(params.get("returnUrl"));
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated() && !isLoading) {
      window.location.href = "/";
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      {returnUrl && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 p-2">
          يرجى تسجيل الدخول للوصول إلى هذه الصفحة
        </div>
      )}

      <LoginForm />
    </div>
  );
}
