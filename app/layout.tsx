"use client";
import "./globals.css";
import Drawer from "@/components/Drawer/page";
import Header from "@/components/Header/page";
import AuthGuard from "@/components/AuthGuard";
import { usePathname } from "next/navigation";
import StoreProvider from "./StoreProvider";
import { Suspense, useEffect, useState } from "react";
import Loader from "../components/Loader/page";
import { motion, AnimatePresence } from "framer-motion";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Pages that don't need sidebar and header
  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isFullWidthPage =
    pathname === "/" || pathname === "/playersManagement/addPlayer";

  return (
    <html lang="en">
      <body className="antialiased bg-linear-to-br from-gray-50 via-white to-gray-100">
        <AuthGuard>
          {isAuthPage ? (
            <main className="min-h-screen">{children}</main>
          ) : (
            <div className="relative min-h-screen flex">
              <Drawer />

              <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
                <Header />

                <Suspense
                  fallback={
                    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
                      <div className="relative">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-500"></div>
                        <p className="mt-4 text-gray-500 text-sm">Loading...</p>
                      </div>
                    </div>
                  }
                >
                  <StoreProvider>
                    <motion.main
                      key={pathname}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className={`
                        flex-1 
                        ${isFullWidthPage ? "p-0" : "p-6 lg:p-8"}
                        transition-all duration-300
                      `}
                    >
                      {children}
                    </motion.main>
                  </StoreProvider>
                </Suspense>
              </div>
            </div>
          )}
        </AuthGuard>
      </body>
    </html>
  );
}
