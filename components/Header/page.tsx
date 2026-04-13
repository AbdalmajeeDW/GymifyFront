"use client";

import { usePathname, useRouter } from "next/navigation";
import { links } from "@/utils/links";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Bell, Plus, User, LogOut, Settings } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";

function Page() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showNotifications) setShowNotifications(false);
      if (showUserMenu) setShowUserMenu(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showNotifications, showUserMenu]);

  const filteredlinks = () => {
    const filterSubLink = links.find((e) => {
      return e.subLinks?.some(
        (s) => s.url === pathname || pathname.startsWith(s.url),
      );
    });
    if (filterSubLink?.subLinks) {
      return filterSubLink.subLinks.find(
        (e) => e.url === pathname || pathname.startsWith(e.url),
      );
    }
    return links.find((e) => e.url === pathname);
  };

  const currentlinke = filteredlinks();

  const pageTitle = currentlinke?.title || "Dashboard";
  const pageDescription = currentlinke?.description || "Welcome to GYMIFY";

  const notifications = [
    { id: 1, title: "New player joined", time: "5 min ago", read: false },
    { id: 2, title: "Subscription expired", time: "1 hour ago", read: false },
    {
      id: 3,
      title: "Training session scheduled",
      time: "2 hours ago",
      read: true,
    },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getAddButtonConfig = () => {
    if (pathname === "/playersManagement") {
      return {
        show: true,
        text: "Add Player",
        onClick: () => router.push("/playersManagement/addPlayer"),
        icon: <Plus className="w-4 h-4" />,
      };
    }
    if (pathname === "/trainersManagement") {
      return {
        show: true,
        text: "Add Trainer",
        onClick: () => router.push("/trainersManagement/addTrainer"),
        icon: <Plus className="w-4 h-4" />,
      };
    }
    if (pathname === "/subscriptionsManagement") {
      return {
        show: true,
        text: "New Subscription",
        onClick: () => router.push("/subscriptionsManagement/add"),
        icon: <Plus className="w-4 h-4" />,
      };
    }
    if (pathname === "/productsManagement") {
      return {
        show: true,
        text: "Add Product",
        onClick: () => router.push("/productsManagement/addProduct"),
        icon: <Plus className="w-4 h-4" />,
      };
    }
    return { show: false };
  };

  const addButtonConfig = getAddButtonConfig();

  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return user?.firstName?.[0]?.toUpperCase() || "U";
  };

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`
        sticky top-0 z-40 transition-all duration-300
        ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg"
            : "bg-white shadow-md"
        }
      `}
    >
      <div className="px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <motion.h1
              key={pageTitle}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl lg:text-3xl font-bold bg-linear-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent truncate"
            >
              {pageTitle}
            </motion.h1>
            <motion.p
              key={pageDescription}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 }}
              className="text-sm text-gray-500 mt-1 truncate"
            >
              {pageDescription}
            </motion.p>
          </div>

          <div className="flex items-center gap-3">
            {addButtonConfig.show && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={addButtonConfig.onClick}
                className="hidden sm:flex cursor-pointer items-center gap-2 px-4 py-2 bg-linear-to-r from-purple-500 to-blue-500 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300"
              >
                {addButtonConfig.icon}
                <span>{addButtonConfig.text}</span>
              </motion.button>
            )}

            {addButtonConfig.show && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={addButtonConfig.onClick}
                className="sm:hidden p-2 bg-linear-to-r from-purple-500 to-blue-500 text-white rounded-lg shadow-md"
              >
                <Plus className="w-5 h-5" />
              </motion.button>
            )}

            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowNotifications(!showNotifications);
                  setShowUserMenu(false);
                }}
                className="relative p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-300"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                {unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
                  >
                    {unreadCount}
                  </motion.span>
                )}
              </motion.button>

              {/* Notifications Dropdown */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-gray-100">
                      <h3 className="font-semibold text-gray-800">
                        Notifications
                      </h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          No notifications
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${
                              !notif.read ? "bg-purple-50" : ""
                            }`}
                          >
                            <p className="text-sm font-medium text-gray-800">
                              {notif.title}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {notif.time}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowUserMenu(!showUserMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-2 p-1 bg-gray-100 hover:bg-gray-200 rounded-full transition-all duration-300"
              >
                <div className="w-8 h-8 rounded-full bg-linear-to-r from-purple-500 to-blue-500 flex items-center justify-center shadow-md">
                  {user?.profileImage ? (
                    <Image
                      width={32}
                      height={32}
                      className="w-full h-full rounded-full object-cover"
                      src={user.profileImage}
                      alt=""
                    />
                  ) : (
                    <span className="text-white text-sm font-bold">
                      {getUserInitials()}
                    </span>
                  )}
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-700 mr-2">
                  {user?.firstName}
                </span>
              </motion.button>

              {/* User Dropdown Menu */}
              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-gray-100 bg-linear-to-r from-purple-50 to-blue-50">
                      <p className="font-semibold text-gray-800">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {user?.email}
                      </p>
                      <span className="inline-block mt-2 px-2 py-0.5 text-xs rounded-full bg-purple-100 text-purple-600">
                        {user?.role}
                      </span>
                    </div>
                    <div className="py-2">
                      <button
                        onClick={() => {
                          router.push("/profile");
                          setShowUserMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </button>
                      <button
                        onClick={() => {
                          router.push("/settings");
                          setShowUserMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </button>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <div className="h-px bg-linear-to-r from-transparent via-gray-200 to-transparent"></div>
    </motion.div>
  );
}

export default Page;
