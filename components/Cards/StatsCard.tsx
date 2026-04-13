import { UserCheck, Users } from "lucide-react";
import React from "react";
import { motion } from "framer-motion";
import MotionCard from "./MotionCard";

interface StatsCard {
  title: { text: string };
  value: { text: any };
  icon?: React.ReactNode;
  hovering?: string;
  bgColor: string;
  gradient: string;
  description: string;
}

export default function StatsCard({
  title,
  value,
  icon,
  hovering,
  bgColor,
  gradient,
  description,
}: StatsCard) {
  return (
    <MotionCard className="relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group">
      <div
        className={`absolute top-0 right-0 w-32 h-32 bg-linear-to-br ${gradient} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`}
      ></div>
      <div className="relative p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl ${bgColor}`}>{icon}</div>
          <span className="text-3xl font-bold text-gray-800">{value.text}</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-1">
          {title.text}
        </h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </MotionCard>
  );
}
