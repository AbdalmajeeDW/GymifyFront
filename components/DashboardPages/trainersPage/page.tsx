"use client";

import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Search,
  Users,
  UserCheck,
  UserPlus,
  Star,
  DollarSign,
  Award,
  Briefcase,
  Filter,
  Eye,
  Edit,
  Trash2,
  Phone,
  Mail,
  Calendar,
} from "lucide-react";
import Image from "next/image";
import {
  fetchTrainers,
  selectAllTrainers,
  statusAllTrainers,
} from "@/store/slices/trainerSlice";
import { statusRequest } from "@/common/enums";
import { Trainer } from "@/store/types/trainer.types";
import Card from "../../Cards/UsersCard";
import StatsCard from "@/components/Cards/StatsCard";
import { deleteTrainer } from "@/store/slices/trainerSlice";

export default function TrainersPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const trainersData = useAppSelector(selectAllTrainers);
  const statusData = useAppSelector(statusAllTrainers);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState<string>(statusRequest.LOADING);
  const [error, setError] = useState<string | null>(null);
  const [filterSpecialization, setFilterSpecialization] =
    useState<string>("all");

  useEffect(() => {
    dispatch(fetchTrainers());
  }, [dispatch]);

  // useEffect(() => {
  //   setLoading(statusData);
  //   if (statusData === statusRequest.FAILED) {
  //     setError("فشل في تحميل البيانات");
  //   }
  // }, [statusData]);

  useEffect(() => {
    if (Array.isArray(trainersData)) {
      console.log("Fetched trainers data:", trainersData);
      setTrainers(trainersData);
    }
  }, [trainersData]);

  // Get unique specializations for filter
  const specializations = useMemo(() => {
    const specs = new Set<string>();
    trainers.forEach((trainer) => {
      if (trainer.trainerData?.specialization) {
        specs.add(trainer.trainerData.specialization);
      }
    });
    return ["all", ...Array.from(specs)];
  }, [trainers]);

  // Filter trainers based on search and specialization
  const filteredTrainers = useMemo(() => {
    let filtered = trainers;

    // Apply search filter
    if (search) {
      filtered = filtered.filter(
        (trainer) =>
          `${trainer.firstName} ${trainer.lastName}`
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          trainer.email.toLowerCase().includes(search.toLowerCase()) ||
          trainer.phone?.includes(search) ||
          trainer.trainerData?.specialization
            ?.toLowerCase()
            .includes(search.toLowerCase()),
      );
    }

    if (filterSpecialization !== "all") {
      filtered = filtered.filter(
        (trainer) =>
          trainer.trainerData?.specialization === filterSpecialization,
      );
    }

    return filtered;
  }, [trainers, search, filterSpecialization]);

  // Stats calculations
  const stats = {
    total: trainers.length,
    active: trainers.filter((t) => t.isActive !== false).length,
    totalClients: trainers.reduce(
      (sum, t) => sum + (t.trainerData?.currentClients || 0),
      0,
    ),
    avgRating:
      trainers.length > 0
        ? (
            trainers.reduce((sum, t) => sum + (t.trainerData?.rating || 0), 0) /
            trainers.length
          ).toFixed(1)
        : "0",
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleView = (id: number) => {
    router.push(`/viewCardDetails/${id}`);
  };

  const handleEdit = (id: number) => {
    router.push(`/trainers/edit/${id}`);
  };

  const handleDelete = (id: number) => {
    dispatch(deleteTrainer(id));
  };

  // if (loading === statusRequest.LOADING) {
  //   return (
  //     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
  //       <div className="relative">
  //         <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
  //         <p className="mt-4 text-gray-500 font-medium">Loading trainers...</p>
  //       </div>
  //     </div>
  //   );
  // }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">!</div>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => dispatch(fetchTrainers())}
            className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100">
      <div className=" mx-auto space-y-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-100 rounded-full filter blur-3xl opacity-20 -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100 rounded-full filter blur-3xl opacity-20 -z-10"></div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2"
        >
          <StatsCard
            bgColor="bg-blue-100"
            description="All registered trainers"
            title={{ text: "Total Trainers" }}
            gradient="from-blue-500 to-blue-600"
            value={{ text: stats.total }}
            icon={<Users className="w-7 h-7 text-blue-600" />}
          />
          <StatsCard
            bgColor="bg-green-100"
            description="Currently active trainers"
            title={{ text: "Active Trainers" }}
            gradient="from-green-500 to-emerald-600"
            value={{ text: stats.active }}
            icon={<UserCheck className="w-7 h-7 text-green-600" />}
          />
          <StatsCard
            bgColor="bg-orange-100"
            description="Clients being trained"
            title={{ text: "Total Clients" }}
            gradient="from-orange-500 to-red-500"
            value={{ text: stats.totalClients }}
            icon={<UserPlus className="w-7 h-7 text-orange-600" />}
          />
          <StatsCard
            bgColor="bg-yellow-100"
            description="Average trainer rating"
            title={{ text: "Avg Rating" }}
            gradient="from-yellow-500 to-orange-500"
            value={{ text: stats.avgRating }}
            icon={<Star className="w-7 h-7 text-yellow-600" />}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
        >
          <div className="bg-linear-to-r from-purple-500 to-blue-500 px-6 py-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5" />
                Trainers List
                <span className="ml-2 px-2 py-1 bg-white/20 rounded-full text-sm">
                  {filteredTrainers.length} total
                </span>
              </h2>

              <div className="flex gap-3 w-full md:w-auto">
                {/* Search Input */}
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, email, or specialization..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200"
                  />
                </div>

                {/* Filter Dropdown - Specialization */}
                <div className="relative">
                  <select
                    value={filterSpecialization}
                    onChange={(e) => setFilterSpecialization(e.target.value)}
                    className="px-4 py-2 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-white/50 appearance-none cursor-pointer pr-10"
                  >
                    <option value="all">All Specializations</option>
                    {specializations.map(
                      (spec) =>
                        spec !== "all" && (
                          <option key={spec} value={spec}>
                            {spec}
                          </option>
                        ),
                    )}
                  </select>
                  <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <Card
              data={filteredTrainers}
              onView={handleView}
              onEdit={handleView}
              onDelete={handleDelete}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
