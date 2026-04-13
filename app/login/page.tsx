"use client";

import { useEffect } from "react";
import LoginForm from "@/components/LoginForm";
import { useAuth } from "@/hooks/useAuth";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("/");

  useEffect(() => {
    let token = localStorage.getItem("auth-token");
    if (isAuthenticated() && !isLoading) {
      window.location.href = "/";
    }
  }, [isAuthenticated, isLoading, returnUrl]);

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
    <div className="   bg-gray-50">
      <div className="">
        {returnUrl && (
          <div className=" bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
            يرجى تسجيل الدخول للوصول إلى هذه الصفحة
          </div>
        )}
        <LoginForm />
      </div>
    </div>
  );
}
