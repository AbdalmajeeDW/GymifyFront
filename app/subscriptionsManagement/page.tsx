"use client";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Loader from "../../components/Loader/page";
import {
  Search,
  Calendar,
  DollarSign,
  Users,
  Wallet,
  Filter,
  RefreshCw,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  PauseCircle,
  Crown,
  Zap,
  TrendingUp,
  UserPlus,
} from "lucide-react";
import { MembershipType, statusRequest } from "@/common/enums";
import StatsCard from "@/components/Cards/StatsCard";

// Data interfaces
interface SubscriptionPackage {
  id: number;
  name: string;
  price: number;
  durationDays: number;
  color: string;
  icon: React.ReactNode;
  memberCount: number;
}

interface Subscription {
  id: number;
  playerId: number;
  playerName: string;
  playerAvatar?: string;
  packageId: number;
  packageName: string;
  startDate: string;
  endDate: string;
  amountPaid: number;
  status: "active" | "expired" | "cancelled" | "suspended";
  daysRemaining: number;
  lastPaymentDate?: string;
}

export default function SubscriptionsPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [packages, setPackages] = useState<SubscriptionPackage[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState<string>(statusRequest.LOADING);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Mock API data fetch
    fetchSubscriptionsData();
  }, []);

  const fetchSubscriptionsData = async () => {
    setLoading(statusRequest.LOADING);
    try {
      // Replace with dispatch(fetchSubscriptions()) and dispatch(fetchPackages())
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock data
      const mockPackages: SubscriptionPackage[] = [
        {
          id: 1,
          name: "Monthly Basic",
          price: 150,
          durationDays: 30,
          color: "from-blue-500 to-blue-600",
          icon: <Zap className="w-5 h-5" />,
          memberCount: 45,
        },
        {
          id: 2,
          name: "Quarterly",
          price: 400,
          durationDays: 90,
          color: "from-green-500 to-emerald-600",
          icon: <TrendingUp className="w-5 h-5" />,
          memberCount: 28,
        },
        {
          id: 3,
          name: "Yearly VIP",
          price: 1400,
          durationDays: 365,
          color: "from-purple-500 to-pink-600",
          icon: <Crown className="w-5 h-5" />,
          memberCount: 12,
        },
        {
          id: 4,
          name: "10 Sessions",
          price: 200,
          durationDays: 60,
          color: "from-orange-500 to-red-500",
          icon: <Calendar className="w-5 h-5" />,
          memberCount: 33,
        },
      ];

      const mockSubscriptions: Subscription[] = [
        {
          id: 1,
          playerId: 1,
          playerName: "Ahmed Mohammed",
          packageId: 1,
          packageName: "Monthly Basic",
          startDate: "2026-03-01",
          endDate: "2026-03-30",
          amountPaid: 150,
          status: "active",
          daysRemaining: 20,
          lastPaymentDate: "2026-03-01",
        },
        {
          id: 2,
          playerId: 2,
          playerName: "Sara Ahmed",
          packageId: 3,
          packageName: "Yearly VIP",
          startDate: "2025-06-01",
          endDate: "2026-06-01",
          amountPaid: 1400,
          status: "active",
          daysRemaining: 52,
          lastPaymentDate: "2025-06-01",
        },
        {
          id: 3,
          playerId: 3,
          playerName: "Mohammed Ali",
          packageId: 2,
          packageName: "Quarterly",
          startDate: "2025-12-01",
          endDate: "2026-03-01",
          amountPaid: 400,
          status: "expired",
          daysRemaining: -30,
          lastPaymentDate: "2025-12-01",
        },
        {
          id: 4,
          playerId: 4,
          playerName: "Nora Khalid",
          packageId: 1,
          packageName: "Monthly Basic",
          startDate: "2026-03-15",
          endDate: "2026-04-14",
          amountPaid: 150,
          status: "active",
          daysRemaining: 5,
          lastPaymentDate: "2026-03-15",
        },
        {
          id: 5,
          playerId: 5,
          playerName: "Omar Hassan",
          packageId: 4,
          packageName: "10 Sessions",
          startDate: "2026-02-01",
          endDate: "2026-04-01",
          amountPaid: 200,
          status: "suspended",
          daysRemaining: -8,
          lastPaymentDate: "2026-02-01",
        },
      ];

      setPackages(mockPackages);
      setSubscriptions(mockSubscriptions);
      setLoading(statusRequest.SUCCEEDED);
    } catch (err) {
      setError("Failed to load data");
      setLoading(statusRequest.FAILED);
    }
  };

  // Subscription statistics
  const statsCards = useMemo(() => {
    const activeCount = subscriptions.filter(
      (s) => s.status === "active",
    ).length;
    const expiredCount = subscriptions.filter(
      (s) => s.status === "expired",
    ).length;
    const expiringSoon = subscriptions.filter(
      (s) =>
        s.status === "active" && s.daysRemaining <= 7 && s.daysRemaining > 0,
    ).length;
    const totalRevenue = subscriptions.reduce(
      (sum, s) => sum + s.amountPaid,
      0,
    );

    return [
      {
        title: { text: "Active Subscriptions" },
        value: { text: activeCount },
        icon: <CheckCircle className="w-7 h-7 text-green-600" />,
        bgColor: "bg-green-100",
        gradient: "from-green-500 to-emerald-600",
        description: "Currently active subscriptions",
      },
      {
        title: { text: "Expired / Cancelled" },
        value: { text: expiredCount },
        icon: <XCircle className="w-7 h-7 text-red-600" />,
        bgColor: "bg-red-100",
        gradient: "from-red-500 to-rose-600",
        description: "Need renewal",
      },
      {
        title: { text: "Expiring Soon" },
        value: { text: expiringSoon },
        icon: <Clock className="w-7 h-7 text-orange-600" />,
        bgColor: "bg-orange-100",
        gradient: "from-orange-500 to-amber-600",
        description: "Less than 7 days remaining",
      },
      {
        title: { text: "Total Revenue" },
        value: { text: `${totalRevenue.toLocaleString()} SAR` },
        icon: <Wallet className="w-7 h-7 text-purple-600" />,
        bgColor: "bg-purple-100",
        gradient: "from-purple-500 to-indigo-600",
        description: "All payments",
      },
    ];
  }, [subscriptions]);

  // Filter subscriptions
  const filteredSubscriptions = useMemo(() => {
    let filtered = subscriptions;

    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter((s) => s.status === filterStatus);
    }

    // Filter by selected package
    if (selectedPackage !== null) {
      filtered = filtered.filter((s) => s.packageId === selectedPackage);
    }

    // Search
    if (search) {
      filtered = filtered.filter(
        (s) =>
          s.playerName.toLowerCase().includes(search.toLowerCase()) ||
          s.packageName.toLowerCase().includes(search.toLowerCase()),
      );
    }

    return filtered;
  }, [subscriptions, filterStatus, selectedPackage, search]);

  // Subscription actions
  const handleRenew = (subscriptionId: number) => {
    router.push(`/subscriptions/renew/${subscriptionId}`);
  };

  const handleViewDetails = (subscriptionId: number) => {
    router.push(`/subscriptions/${subscriptionId}`);
  };

  const handleCancel = (subscriptionId: number) => {
    // dispatch(cancelSubscription(subscriptionId));
    console.log("Cancel subscription:", subscriptionId);
  };

  const handleAddSubscription = () => {
    router.push("/subscriptions/add");
  };

  return (
    <div className="bg-linear-to-br from-gray-50 via-white to-gray-100 ">
      {loading === statusRequest.LOADING ? (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-md z-50 flex items-center justify-center min-h-screen">
          <div className="relative">
            <div className="absolute inset-0 bg-white/50 rounded-2xl blur-xl"></div>
            <div className="relative bg-white/90 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 flex flex-col items-center gap-4">
              <Loader className="text-purple-700 w-12 h-12" />
              <p className="text-gray-600 font-medium animate-pulse">
                Loading...
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className=" mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {statsCards.map((card, i) => (
              <StatsCard
                key={i}
                title={card.title}
                value={card.value}
                icon={card.icon}
                bgColor={card.bgColor}
                gradient={card.gradient}
                description={card.description}
              />
            ))}
          </motion.div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Package className="w-5 h-5 text-purple-500" />
                Subscription Packages
                <span className="text-sm text-gray-500 font-normal">
                  (Select a package to view subscribers)
                </span>
              </h3>
              <button
                onClick={() => setSelectedPackage(null)}
                className={`px-3 py-1 rounded-lg text-sm transition-all ${
                  selectedPackage === null
                    ? "bg-purple-500 text-white"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                }`}
              >
                All
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {packages.map((pkg) => (
                <motion.div
                  key={pkg.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() =>
                    setSelectedPackage(
                      selectedPackage === pkg.id ? null : pkg.id,
                    )
                  }
                  className={`cursor-pointer rounded-xl overflow-hidden transition-all duration-300 ${
                    selectedPackage === pkg.id
                      ? "ring-2 ring-purple-500 shadow-lg scale-[1.02]"
                      : "hover:shadow-md"
                  }`}
                >
                  <div className={`bg-linear-to-r ${pkg.color} p-4 text-white`}>
                    <div className="flex justify-between items-start">
                      <div className="p-2 bg-white/20 rounded-lg">
                        {pkg.icon}
                      </div>
                      <span className="text-2xl font-bold">
                        {pkg.price} SAR
                      </span>
                    </div>
                    <h4 className="text-xl font-bold mt-3">{pkg.name}</h4>
                    <p className="text-white/80 text-sm">
                      {pkg.durationDays} days
                    </p>
                  </div>
                  <div className="bg-white p-3 flex justify-between items-center">
                    <span className="text-gray-600">
                      <Users className="w-4 h-4 inline ml-1" />
                      {pkg.memberCount} subscribers
                    </span>
                    <span className="text-purple-500 text-sm font-medium">
                      {selectedPackage === pkg.id
                        ? "✓ Selected"
                        : "View members"}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Subscriptions Table */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-linear-to-r from-purple-500 to-blue-500 px-6 py-4">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Subscriptions List
                  <span className="ml-2 px-2 py-1 bg-white/20 rounded-full text-sm">
                    {filteredSubscriptions.length} subscriptions
                  </span>
                </h2>

                <div className="flex gap-3 w-full md:w-auto">
                  <div className="relative flex-1 md:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by player name or package..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200"
                    />
                  </div>

                  <div className="relative">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-4 py-2 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-white/50 appearance-none cursor-pointer pr-10"
                    >
                      <option value="all">All Statuses</option>
                      <option value="active">Active</option>
                      <option value="expired">Expired</option>
                      <option value="suspended">Suspended</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>

                  <button
                    onClick={handleAddSubscription}
                    className="px-4 py-2 bg-white text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-all duration-200 flex items-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    New Subscription
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4">
              {filteredSubscriptions.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">
                    No subscriptions found
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    {search || filterStatus !== "all" || selectedPackage
                      ? "Try adjusting your search criteria"
                      : "Add your first subscription to get started"}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-right py-3 px-4 text-gray-600 font-semibold">
                          Player
                        </th>
                        <th className="text-right py-3 px-4 text-gray-600 font-semibold">
                          Package
                        </th>
                        <th className="text-right py-3 px-4 text-gray-600 font-semibold">
                          Start Date
                        </th>
                        <th className="text-right py-3 px-4 text-gray-600 font-semibold">
                          End Date
                        </th>
                        <th className="text-right py-3 px-4 text-gray-600 font-semibold">
                          Remaining
                        </th>
                        <th className="text-right py-3 px-4 text-gray-600 font-semibold">
                          Amount
                        </th>
                        <th className="text-right py-3 px-4 text-gray-600 font-semibold">
                          Status
                        </th>
                        <th className="text-right py-3 px-4 text-gray-600 font-semibold">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSubscriptions.map((sub) => (
                        <tr
                          key={sub.id}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                <span className="text-purple-600 font-medium text-sm">
                                  {sub.playerName.charAt(0)}
                                </span>
                              </div>
                              <span className="font-medium text-gray-800">
                                {sub.playerName}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm">
                              {sub.packageName}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-600">
                            {sub.startDate}
                          </td>
                          <td className="py-3 px-4 text-gray-600">
                            {sub.endDate}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`font-medium ${
                                sub.daysRemaining <= 0
                                  ? "text-red-600"
                                  : sub.daysRemaining <= 7
                                    ? "text-orange-600"
                                    : "text-green-600"
                              }`}
                            >
                              {sub.daysRemaining <= 0
                                ? "Expired"
                                : `${sub.daysRemaining} days`}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-medium text-gray-800">
                            {sub.amountPaid} SAR
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                sub.status === "active"
                                  ? "bg-green-100 text-green-700"
                                  : sub.status === "expired"
                                    ? "bg-red-100 text-red-700"
                                    : sub.status === "suspended"
                                      ? "bg-yellow-100 text-yellow-700"
                                      : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {sub.status === "active" && (
                                <CheckCircle className="w-3 h-3" />
                              )}
                              {sub.status === "expired" && (
                                <AlertCircle className="w-3 h-3" />
                              )}
                              {sub.status === "suspended" && (
                                <PauseCircle className="w-3 h-3" />
                              )}
                              {sub.status === "active"
                                ? "Active"
                                : sub.status === "expired"
                                  ? "Expired"
                                  : sub.status === "suspended"
                                    ? "Suspended"
                                    : "Cancelled"}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleViewDetails(sub.id)}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="View details"
                              >
                                <Search className="w-4 h-4" />
                              </button>
                              {sub.status === "expired" && (
                                <button
                                  onClick={() => handleRenew(sub.id)}
                                  className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                  title="Renew"
                                >
                                  <RefreshCw className="w-4 h-4" />
                                </button>
                              )}
                              {sub.status === "active" && (
                                <button
                                  onClick={() => handleCancel(sub.id)}
                                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Cancel"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Package icon component if not already available
const Package = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
    />
  </svg>
);
