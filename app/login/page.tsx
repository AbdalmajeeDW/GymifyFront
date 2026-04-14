"use client";

import { useEffect } from "react";
import LoginForm from "@/components/LoginForm";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth();

  const returnUrl =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("returnUrl")
      : null;

  useEffect(() => {
    if (isAuthenticated() && !isLoading) {
      window.location.href = "/";
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <div>
        {returnUrl && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 rounded p-3">
            يرجى تسجيل الدخول للوصول إلى هذه الصفحة
          </div>
        )}

        <LoginForm />
      </div>
    </div>
  );
}
