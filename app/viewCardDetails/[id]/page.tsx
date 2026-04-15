"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUser, selectedUser } from "@/store/slices/userSlice";
import { useParams } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

import {
  Mail,
  Phone,
  Calendar,
  User,
  Activity,
  Ruler,
  Weight,
  Crown,
  TrendingUp,
} from "lucide-react";

import { isPlayer } from "@/store/types/player.types";
import { isTrainer } from "@/store/types/trainer.types";

export default function Page() {
  const params = useParams();

  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const dispatch = useAppDispatch();
  const user = useAppSelector(selectedUser);

  const player = user && isPlayer(user) ? user : null;
  const trainer = user && isTrainer(user) ? user : null;
  useEffect(() => {
    if (id) dispatch(fetchUser(id));
  }, [dispatch, id]);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
          <p className="mt-4 text-gray-500 font-medium">
            Loading player profile...
          </p>
        </div>
      </div>
    );
  }

  const fullName = `${user.firstName} ${user.lastName}`;

  const membershipColors: Record<string, string> = {
    premium: "bg-gradient-to-r from-yellow-400 to-amber-500",
    gold: "bg-gradient-to-r from-yellow-500 to-yellow-600",
    silver: "bg-gradient-to-r from-gray-300 to-gray-400",
    bronze: "bg-gradient-to-r from-amber-600 to-amber-700",
    basic: "bg-gradient-to-r from-blue-400 to-blue-500",
  };

  const membershipType = player?.playerData?.membershipType?.toLowerCase();

  const membershipColor = membershipType
    ? (membershipColors[membershipType] ??
      "bg-gradient-to-r from-purple-400 to-purple-500")
    : "bg-gradient-to-r from-purple-400 to-purple-500";

  return (
    <div className="max-h-screen bg-linear-to-r from-gray-50 via-white to-gray-100">
      <div className="mx-auto space-y-8">
        {/* ===== HEADER CARD ===== */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300"
        >
          <div className="absolute inset-0 bg-linear-to-r from-purple-500/10 to-blue-500/10"></div>

          <div className="relative p-8 flex flex-col md:flex-row items-center gap-8">
            {/* IMAGE */}
            <div className="relative group">
              <div
                className={`absolute inset-0 rounded-2xl ${membershipColor} blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300`}
              ></div>

              <div className="relative w-32 h-32 md:w-36 md:h-36">
                <Image
                  src={`http://localhost:3000${user.profileImage}`}
                  alt={fullName}
                  fill
                  className="rounded-2xl object-cover border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-300"
                  unoptimized={true}
                />
              </div>

              <div
                className={`absolute -bottom-2 -right-2 ${membershipColor} text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg`}
              >
                {player?.playerData?.membershipType}
              </div>
            </div>

            {/* INFO SECTION */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                {fullName}
              </h1>

              <p className="text-gray-500 mt-2 flex items-center justify-center md:justify-start gap-2">
                <Mail className="w-4 h-4" />
                {user.email}
              </p>

              <div className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
                <span className="px-4 py-2 text-sm font-semibold rounded-full bg-linear-to-r from-purple-100 to-purple-200 text-purple-700 shadow-sm">
                  {user.role}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ===== STATS GRID ===== */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 },
            },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {[
            {
              icon: Crown,
              label: player ? "Membership" : "Current clients",
              value: player
                ? player?.playerData?.membershipType
                : trainer?.trainerData.currentClients,
              color: "from-yellow-400 to-amber-500",
            },
            {
              icon: Calendar,
              label: "Age",
              value: player?.playerData?.year,
              suffix: " years",
              color: "from-blue-400 to-blue-500",
            },
            {
              icon: player?.playerData ? Ruler : Sparkles,
              label: player?.playerData ? "Height" : "Experience years",
              value: player
                ? player?.playerData?.height
                : trainer?.trainerData.experienceYears,
              suffix: player && " cm",
              color: "from-green-400 to-emerald-500",
            },
            {
              icon: Weight,
              label: "Weight",
              value: player ? (player?.playerData?.weight ?? "N/A") : "N/A",
              suffix: " kg",
              color: "from-orange-400 to-red-500",
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ y: -5 }}
              className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div
                className={`absolute top-0 right-0 w-32 h-32 bg-linear-to-r ${stat.color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`}
              ></div>

              <div className="relative p-6">
                <div
                  className={`inline-flex p-3 rounded-xl bg-linear-to-r ${stat.color} text-white shadow-lg mb-4`}
                >
                  <stat.icon className="w-6 h-6" />
                </div>

                <p className="text-gray-500 text-sm font-medium mb-1">
                  {stat.label}
                </p>

                <p className="text-2xl font-bold text-gray-800">
                  {stat.value || "N/A"}
                  {stat.suffix || ""}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ===== DETAILS ===== */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* CONTACT */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            <div className="bg-linear-to-r from-purple-500 to-blue-500 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <User className="w-5 h-5" />
                Contact Information
              </h2>
            </div>

            <div className="p-6 space-y-4">
              {[
                {
                  icon: Mail,
                  label: "Email",
                  value: user.email,
                  color: "text-blue-500",
                },
                {
                  icon: Phone,
                  label: "Phone",
                  value: user.phone,
                  color: "text-green-500",
                },
                {
                  icon: User,
                  label: "Gender",
                  value: user.gender,
                  color: "text-purple-500",
                },
                {
                  icon: Calendar,
                  label: "Created At",
                  value: new Date(user.createdAt || "").toLocaleDateString(
                    "en-US",
                    { year: "numeric", month: "long", day: "numeric" },
                  ),
                  color: "text-orange-500",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className={`p-2 bg-gray-100 rounded-lg ${item.color}`}>
                    <item.icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1">
                    <p className="text-xs text-gray-400 font-medium">
                      {item.label}
                    </p>
                    <p className="text-gray-700 font-medium mt-1">
                      {item.value || "Not provided"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* FITNESS */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            <div className="bg-linear-to-r from-blue-500 to-cyan-500 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Fitness Overview
              </h2>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between p-4 bg-linear-to-r from-purple-50 to-blue-50 rounded-xl">
                <div>
                  <p className="text-sm text-gray-500">Fitness Level</p>
                  <p className="text-xl font-bold text-gray-800">
                    Intermediate
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-500" />
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Current Goals
                </p>

                <div className="flex flex-wrap gap-2">
                  {["Strength Training", "Cardio", "Flexibility"].map(
                    (goal, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full"
                      >
                        {goal}
                      </span>
                    ),
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
