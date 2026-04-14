import Image from "next/image";
import { FaEye } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { motion } from "framer-motion";
import {
  Calendar,
  Crown,
  Star,
  TrendingUp,
  User,
  Briefcase,
} from "lucide-react";
import { Player } from "@/store/types/player.types";
import { Trainer } from "@/store/types/trainer.types";
import { Button } from "../ui/button";

interface CardProps {
  data: Trainer[] | Player[];
  onView: (id: number) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  isDrawerOpen?: boolean;
}

const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
    return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
  } catch {
    return "N/A";
  }
};

const getMembershipColor = (type: string) => {
  switch (type?.toLowerCase()) {
    case "premium":
      return {
        bg: "from-yellow-400 to-amber-500",
        text: "text-yellow-600",
        icon: <Crown className="w-4 h-4" />,
        shadow: "shadow-yellow-400/50 shadow-lg",
        border: "border-yellow-400",
        button:
          "bg-linear-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600",
      };
    case "gold":
      return {
        bg: "from-yellow-500 to-yellow-600",
        text: "text-yellow-600",
        icon: <Star className="w-4 h-4" />,
        shadow: "shadow-yellow-500/50 shadow-lg",
        border: "border-yellow-500",
        button:
          "bg-linear-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700",
      };
    default:
      return {
        bg: "from-blue-400 to-blue-500",
        text: "text-blue-600",
        icon: <User className="w-4 h-4" />,
        shadow: "shadow-blue-500/50 shadow-lg",
        border: "border-blue-500",
        button:
          "bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
      };
  }
};

export default function SharedCard({
  data = [],
  onView,
  onEdit,
  onDelete,
  isDrawerOpen = false, // Default to false
}: CardProps) {
  // Calculate responsive grid columns based on screen size and drawer state
  const getGridCols = () => {
    const baseCols = {
      xs: "grid-cols-1",
      sm: "sm:grid-cols-1",
      md: "md:grid-cols-2",
      lg: "lg:grid-cols-2",
      xl: "xl:grid-cols-3",
      "2xl": "2xl:grid-cols-4",
      "3xl": "3xl:grid-cols-5",
    };

    if (isDrawerOpen) {
      return {
        ...baseCols,
        xl: "xl:grid-cols-2",
        "2xl": "2xl:grid-cols-3",
        "3xl": "3xl:grid-cols-3",
      };
    }

    return baseCols;
  };

  const gridCols = getGridCols();

  return (
    <div className={`w-full transition-all duration-300 ease-in-out`}>
      <div
        className={`
          grid gap-4 sm:gap-5 md:gap-6
          ${gridCols.xs}
          ${gridCols.sm}
          ${gridCols.md}
          ${gridCols.lg}
          ${gridCols.xl}
          ${gridCols["2xl"]}
          ${gridCols["3xl"]}
          auto-rows-fr
        `}
      >
        {data.map((user) => {
          const isPlayer = "playerData" in user;
          const fullName = `${user.firstName} ${user.lastName}`;
          const initials =
            `${user.firstName?.[0]}${user.lastName?.[0]}`.toUpperCase();
          const membershipColor = getMembershipColor(
            isPlayer ? user.playerData?.membershipType : "",
          );

          const badgeColor = isPlayer
            ? membershipColor.bg
            : "from-purple-500 to-blue-500";
          const titleColor = isPlayer
            ? membershipColor.text
            : "text-purple-600";
          const badgeIcon = isPlayer ? (
            membershipColor.icon
          ) : (
            <Briefcase className="w-4 h-4" />
          );
          const badgeText = isPlayer
            ? user.playerData?.membershipType || "Basic"
            : "Trainer";
          const buttonColor = isPlayer
            ? membershipColor.button
            : "bg-linear-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600";

          const imageShadow = isPlayer
            ? membershipColor.shadow
            : "shadow-purple-500/50 shadow-lg";
          const imageBorder = isPlayer
            ? membershipColor.border
            : "border-purple-500";

          return (
            <motion.div
              key={user.id}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col h-full"
            >
              <div
                className={`absolute inset-0 bg-linear-to-br ${badgeColor} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
              ></div>

              <div
                className={`absolute top-4 right-4 z-10 px-3 py-1.5 rounded-lg bg-linear-to-r ${badgeColor} text-white text-xs font-semibold shadow-lg flex items-center gap-1.5 backdrop-blur-sm`}
              >
                {badgeIcon}
                <span>{badgeText}</span>
              </div>

              <div className="relative p-4 sm:p-5 md:p-6 flex flex-col ">
                <div className="flex justify-center mb-4">
                  <div
                    className={`relative w-24 h-24 sm:w-28 sm:h-28 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full bg-linear-to-r ${badgeColor} flex items-center justify-center shadow-xl ${imageShadow} transition-all duration-300 group-hover:scale-105`}
                  >
                    {user.profileImage ? (
                      <Image
                        width={128}
                        height={128}
                        className={`w-full h-full rounded-full object-cover border-4 ${imageBorder} bg-white`}
                        src={`https://gymifyback.onrender.com${user.profileImage}`}
                        alt={fullName}
                        unoptimized
                      />
                    ) : (
                      <span className="text-white text-2xl sm:text-3xl font-bold">
                        {initials}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-center mb-4 sm:mb-5">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 line-clamp-1 px-2">
                    {fullName}
                  </h3>
                  <span
                    className={`text-xs sm:text-sm font-semibold ${titleColor}`}
                  >
                    {isPlayer ? "Player" : "Trainer"}
                  </span>
                </div>

                <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6 ">
                  <div className="flex justify-between items-center text-xs sm:text-sm py-1 border-b border-gray-100">
                    <span className="text-gray-500 flex items-center gap-1 sm:gap-1.5">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                      {isPlayer ? "Age:" : "Specialization:"}
                    </span>
                    <span className="font-semibold text-gray-700 truncate ml-2">
                      {/* {isPlayer
                        ? `${user.playerData?.year || 0} years`
                        : user.trainer?.specialization || "N/A"} */}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs sm:text-sm py-1 border-b border-gray-100">
                    <span className="text-gray-500 flex items-center gap-1 sm:gap-1.5">
                      <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                      {isPlayer ? "Height/Weight:" : "Experience:"}
                    </span>
                    <span className="font-semibold text-gray-700">
                      {/* {isPlayer
                        ? `${user.playerData?.height || 0}cm / ${user.playerData?.weight || 0}kg`
                        : `${user.trainer?.experienceYears || 0} years`} */}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs sm:text-sm py-1 border-b border-gray-100">
                    <span className="text-gray-500 flex items-center gap-1 sm:gap-1.5">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                      Joined:
                    </span>
                    <span className="font-semibold text-gray-700">
                      {formatDate(user.createdAt?.toString() || "")}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-1.5 sm:gap-2 py-3 sm:py-4 mt-auto pt-3 sm:pt-4 border-t border-gray-100">
                  <Button
                    className={`${buttonColor} text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-xs sm:text-sm font-semibold py-2 sm:py-2.5 px-1 sm:px-2 w-full min-w-0`}
                    onClick={() => onView(user.id ?? 0)}
                    titleAfterLoading="View"
                    titleIsLoading="Loading..."
                    iconAfterLoading={
                      <FaEye className="w-3 h-3 sm:w-4 sm:h-4" />
                    }
                  >
                    <span className="hidden sm:inline">View</span>
                    <span className="sm:hidden">
                      <FaEye />
                    </span>
                  </Button>

                  {onEdit && (
                    <Button
                      className={`bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300 text-xs sm:text-sm font-semibold py-2 sm:py-2.5 px-1 sm:px-2 w-full min-w-0`}
                      onClick={() => onEdit(user.id ?? 0)}
                      titleAfterLoading="Edit"
                      titleIsLoading="Loading..."
                      iconAfterLoading={
                        <MdEdit className="w-3 h-3 sm:w-4 sm:h-4" />
                      }
                    >
                      <span className="hidden sm:inline">Edit</span>
                      <span className="sm:hidden">
                        <MdEdit />
                      </span>
                    </Button>
                  )}

                  {onDelete && (
                    <Button
                      className={`bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all duration-300 text-xs sm:text-sm font-semibold py-2 sm:py-2.5 px-1 sm:px-2 w-full min-w-0`}
                      onClick={() => onDelete(user.id ?? 0)}
                      titleAfterLoading="Delete"
                      titleIsLoading="Loading..."
                      iconAfterLoading={
                        <MdDelete className="w-3 h-3 sm:w-4 sm:h-4" />
                      }
                    >
                      <span className="hidden sm:inline">Delete</span>
                      <span className="sm:hidden">
                        <MdDelete />
                      </span>
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}

        {data.length === 0 && (
          <div className="col-span-full text-center py-12 sm:py-16">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" />
            </div>
            <p className="text-gray-500 text-base sm:text-lg">No data found</p>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">
              No trainers or players available
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
