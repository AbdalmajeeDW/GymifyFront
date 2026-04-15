"use client";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Loader from "../../Loader/page";
import {
  Search,
  Users,
  UserCheck,
  UserPlus,
  Crown,
  Filter,
} from "lucide-react";
import Card from "../../Cards/UsersCard";
import {
  deleteUser,
  fetchUsers,
  selectAllUsers,
  statusAllUsers,
} from "@/store/slices/playerSlice";
import { Player } from "@/store/types/player.types";
import { MembershipType, statusRequest } from "@/common/enums";
import StatsCard from "@/components/Cards/StatsCard";

export default function UsersPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const userData = useAppSelector(selectAllUsers);
  const statusData = useAppSelector(statusAllUsers);
  const [users, setUsers] = useState<Player[]>([]);
  const [premium, setPremium] = useState<Player[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState<string>(statusRequest.LOADING);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>("all");

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    setLoading(statusData);
    if (statusData === statusRequest.FAILED) {
      setError("فشل في تحميل البيانات");
    }
  }, [statusData]);

  useEffect(() => {
    if (Array.isArray(userData)) {
      setUsers(userData);
      const filtered = userData.filter(
        (user) => user.playerData?.membershipType === "premium",
      );
      setPremium(filtered);
    }
  }, [userData]);

  const filteredUsers = useMemo(() => {
    let filtered = users;

    if (search) {
      filtered = filtered.filter(
        (user) =>
          `${user.firstName} ${user.lastName}`
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase()) ||
          user.phone?.includes(search),
      );
    }

    if (filterType !== "all") {
      filtered = filtered.filter(
        (user) =>
          user?.playerData?.membershipType?.toLowerCase() ===
          filterType.toLowerCase(),
      );
    }

    return filtered;
  }, [users, search, filterType]);

  const cardArray = [
    {
      title: { text: "Total Players" },
      value: { text: users.length },
      icon: <Users className="w-7 h-7 text-blue-600" />,
      bgColor: "bg-blue-100",
      gradient: "from-blue-500 to-blue-600",
      description: "All registered players",
    },
    {
      title: { text: "Active Players" },
      // value: { text: users.filter((u) => u.isActive).length },
      icon: <UserCheck className="w-7 h-7 text-green-600" />,
      bgColor: "bg-green-100",
      gradient: "from-green-500 to-emerald-600",
      description: "Currently active members",
    },
    {
      title: { text: "New Signups" },
      value: {
        text: users.filter((u) => {
          if (!u?.createdAt) return false;
          const createdAt = new Date(u.createdAt);
          const now = new Date();
          const diffTime = Math.abs(now.getTime() - createdAt.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays <= 30;
        }).length,
      },
      icon: <UserPlus className="w-7 h-7 text-orange-600" />,
      bgColor: "bg-orange-100",
      gradient: "from-orange-500 to-red-500",
      description: "Last 30 days",
    },
    {
      title: { text: "Premium Players" },
      value: { text: premium.length },
      icon: <Crown className="w-7 h-7 text-purple-600" />,
      bgColor: "bg-purple-100",
      gradient: "from-purple-500 to-pink-500",
      description: "Premium members",
    },
  ];

  const handleView = async (id: number) => {
    router.push(`/viewCardDetails/${id}`);
  };
  const handleDelete = async (id: number) => {
    dispatch(deleteUser(id));
  };

  return (
    <div className=" bg-linear-to-br from-gray-50 via-white to-gray-100 ">
      {loading === statusRequest.LOADING ? (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-md z-50 flex items-center justify-center min-h-screen">
          <div className="relative">
            <div className="absolute inset-0 bg-white/50 rounded-2xl blur-xl"></div>
            <div className="relative bg-white/90 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 flex flex-col items-center gap-4">
              <Loader className="text-purple-700 w-12 h-12" />
              <p className="text-gray-600 font-medium animate-pulse">
                Please wait while the data is displayed....
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className=" mx-auto space-y-8">
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {cardArray.map((card, i) => (
              <StatsCard
                key={i}
                title={card.title}
                value={{ text: card.value?.text }}
                icon={card.icon}
                bgColor={card.bgColor}
                gradient={card.gradient}
                description={card.description}
              />
            ))}
          </motion.div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-linear-to-r from-purple-500 to-blue-500 px-6 py-4">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Players List
                  <span className="ml-2 px-2 py-1 bg-white/20 rounded-full text-sm">
                    {filteredUsers.length} total
                  </span>
                </h2>

                <div className="flex gap-3 w-full md:w-auto">
                  <div className="relative flex-1 md:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by name, email, or phone..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200"
                    />
                  </div>

                  <div className="relative">
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="px-4 py-2 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-white/50 appearance-none cursor-pointer"
                    >
                      {Object.values(MembershipType).map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3">
              {filteredUsers.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No players found</p>
                  <p className="text-gray-400 text-sm mt-2">
                    {search
                      ? "Try adjusting your search criteria"
                      : "Add your first player to get started"}
                  </p>
                </div>
              ) : (
                <Card
                  data={filteredUsers}
                  onView={handleView}
                  onEdit={handleView}
                  onDelete={handleDelete}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
