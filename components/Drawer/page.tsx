"use client";
import { FaDumbbell } from "react-icons/fa";
import { useAuth } from "@/hooks/useAuth";
import { usePathname } from "next/navigation";
import { links } from "../../utils/links";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";

export default function Page() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return user?.firstName?.[0]?.toUpperCase() || "U";
  };

  // Get role badge color
  const getRoleColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "bg-purple-500/20 text-purple-300";
      case "trainer":
        return "bg-blue-500/20 text-blue-300";
      case "player":
        return "bg-green-500/20 text-green-300";
      default:
        return "bg-gray-500/20 text-gray-300";
    }
  };

  const sidebarVariants = {
    expanded: { width: "208px" },
    collapsed: { width: "80px" },
  };

  const linkVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  const menuItems = links.filter((link) => link.name !== "Logout");
  const logoutItem = links.find((link) => link.name === "Logout");

  return (
    <>
      <motion.div
        initial={false}
        animate={isCollapsed ? "collapsed" : "expanded"}
        variants={sidebarVariants}
        transition={{ duration: 0.3, type: "spring", damping: 20 }}
        className="fixed top-0 left-0 h-screen z-50
          bg-linear-to-b from-gray-900 via-gray-800 to-gray-900
          shadow-2xl overflow-hidden"
      >
        {/* Sidebar Content */}
        <div className="relative h-full flex flex-col overflow-y-auto overflow-x-hidden">
          {/* Custom Scrollbar Styles */}
          <style jsx>{`
            .overflow-y-auto::-webkit-scrollbar {
              width: 4px;
            }
            .overflow-y-auto::-webkit-scrollbar-track {
              background: rgba(255, 255, 255, 0.1);
              border-radius: 10px;
            }
            .overflow-y-auto::-webkit-scrollbar-thumb {
              background: rgba(255, 255, 255, 0.3);
              border-radius: 10px;
            }
            .overflow-y-auto::-webkit-scrollbar-thumb:hover {
              background: rgba(255, 255, 255, 0.5);
            }
          `}</style>
          <button
            onClick={toggleSidebar}
            className="absolute -right-3 top-20 z-50 p-1.5 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-purple-500 transition-colors" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-gray-600 group-hover:text-purple-500 transition-colors" />
            )}
          </button>
          {/* Logo Section */}
          <div
            className={`px-4 pt-8 pb-6 shrink-0 ${isCollapsed ? "px-2" : "px-4"}`}
          >
            <div
              className={`flex items-center ${isCollapsed ? "justify-center" : "justify-center gap-2"}`}
            >
              <motion.div whileHover={{ rotate: 10 }} className="relative">
                <div className="absolute inset-0 bg-linear-to-r from-purple-500 to-blue-500 rounded-full blur-lg opacity-50"></div>
                <FaDumbbell
                  size={28}
                  className="relative text-purple-400 rotate-60"
                />
              </motion.div>
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="text-xl font-bold bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent whitespace-nowrap"
                  >
                    GYMIFY
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <div className="h-0.5 bg-linear-to-r from-transparent via-purple-800 to-transparent mx-4 "></div>{" "}
          {/* User Profile Section */}
          <div
            className={`px-4 py-6 shrink-0 ${isCollapsed ? "px-2" : "px-4"}`}
          >
            <motion.div whileHover={{ scale: 1.02 }} className="relative group">
              <div
                className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"}`}
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className="absolute inset-0 bg-linear-to-r from-purple-500 to-blue-500 rounded-full blur-sm opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative w-12 h-12 rounded-full bg-linear-to-r from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
                    {user?.profileImage ? (
                      <Image
                        width={48}
                        height={48}
                        className="w-full h-full rounded-full object-cover"
                        src={user.profileImage}
                        alt=""
                      />
                    ) : (
                      <span className="text-white font-bold text-lg">
                        {getUserInitials()}
                      </span>
                    )}
                  </div>
                </div>

                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="flex-1 min-w-0"
                    >
                      <p className="text-white font-semibold truncate">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${getRoleColor(user?.role || "")}`}
                        >
                          {user?.role}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
          <div className="h-0.5 bg-linear-to-r from-transparent via-purple-800 to-transparent mx-4 "></div>{" "}
          {/* Navigation Menu */}
          <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-3 min-h-0">
            <ul className="space-y-1">
              {menuItems.map((link, index) => {
                const isActive =
                  pathname === link.url ||
                  link.subLinks?.some((sub) => pathname === sub.url);

                return (
                  <motion.li
                    key={link.id}
                    initial="initial"
                    animate="animate"
                    variants={linkVariants}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={link.url}
                      className={`
                        relative flex items-center 
                        ${isCollapsed ? "justify-center" : "gap-3"} 
                        px-3 py-3 rounded-xl
                        transition-all duration-300 group
                        ${
                          isActive
                            ? "bg-linear-to-r from-purple-500/20 to-blue-500/20 text-white shadow-lg"
                            : "text-gray-300 hover:text-white hover:bg-white/10"
                        }
                      `}
                    >
                      {/* Active Indicator */}
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute left-0 w-1 h-8 bg-linear-to-b from-purple-400 to-blue-400 rounded-r-full"
                        />
                      )}

                      {/* Icon */}
                      <span
                        className={`relative z-10 shrink-0 ${isActive ? "text-purple-400" : "text-gray-400 group-hover:text-purple-400"}`}
                      >
                        {link.icon}
                      </span>

                      {/* Label - يظهر فقط عند التوسيع */}
                      <AnimatePresence>
                        {!isCollapsed && (
                          <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            className="relative z-10 font-medium text-sm whitespace-nowrap"
                          >
                            {link.name}
                          </motion.span>
                        )}
                      </AnimatePresence>

                      {/* Tooltip for collapsed state */}
                      {isCollapsed && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none">
                          {link.name}
                        </div>
                      )}
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
          </nav>
          {/* Logout Button */}
          <div className="p-3 mt-auto border-t border-gray-700/50 shrink-0">
            <Link
              href={logoutItem?.url || "/login"}
              onClick={logout}
              className={`
                flex items-center 
                ${isCollapsed ? "justify-center" : "gap-3"} 
                px-3 py-3 rounded-xl
                transition-all duration-300 group
                text-red-300 hover:text-red-400 hover:bg-red-500/10
              `}
            >
              <LogOut className="w-5 h-5 shrink-0" />

              {/* Logout text - يظهر فقط عند التوسيع */}
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="font-medium text-sm whitespace-nowrap"
                  >
                    Logout
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none">
                  Logout
                </div>
              )}
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Main Content Spacer - يخلق مساحة للـ Sidebar */}
      <div
        className={`transition-all duration-300 ${isCollapsed ? "w-20" : "w-52"}`}
      />
    </>
  );
}
