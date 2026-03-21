import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  BookOpen,
  Calendar,
  TrendingUp,
  Award,
  Bell,
  LogOut,
  ArrowUp,
  UserCheck,
  GraduationCap,
} from "lucide-react";
import {
  recentActivities,
  upcomingEvents,
  performanceData,
} from "../../../data/data";
import { useGetDashboardStatsQuery } from "../redux/feature/authslice";

const Dashboard = () => {
  const navigate = useNavigate();
  const { data: statsData, isLoading } = useGetDashboardStatsQuery();
  const [dynamicStats, setDynamicStats] = useState([]);

  // --- Backend Data Logic ---
  useEffect(() => {
    if (statsData?.stats) {
      // Icon mapping based on keys (Add more as per your backend keys)
      const iconMap = {
        students: GraduationCap,
        teachers: UserCheck,
        classes: BookOpen,
        events: Calendar,
        awards: Award,
        users: Users,
      };

      // Color mapping for a professional look
      const colors = [
        "bg-blue-600",
        "bg-emerald-600",
        "bg-violet-600",
        "bg-amber-600",
      ];

      const stats = Object.keys(statsData.stats).map((key, index) => ({
        label: key
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase()), // camelCase to Title Case
        value: statsData.stats[key],
        icon: iconMap[key.toLowerCase()] || Users,
        color: colors[index % colors.length], // Rotates colors
      }));
      setDynamicStats(stats);
    }
  }, [statsData]);

  // --- Logout Logic ---
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      navigate("/");
    }
  };

  // --- Scroll Logic ---
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showLogout, setShowLogout] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setShowScrollTop(currentScrollY > 200);
      setShowLogout(currentScrollY < lastScrollY || currentScrollY < 50);
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  return (
    <div className="p-4 sm:p-8 bg-[#f8fafc] min-h-screen relative font-sans">
      {/* --- LOGOUT BUTTON --- */}
      <button
        onClick={handleLogout}
        className={`fixed top-4 right-4 z-50 flex items-center gap-2 bg-white border border-gray-200 text-gray-700 hover:text-red-600 px-4 py-2 rounded-full shadow-sm transition-all duration-300 font-medium text-sm
          ${showLogout ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"}
        `}
      >
        <LogOut size={16} />
        <span className="hidden sm:inline">Sign Out</span>
      </button>

      {/* --- SCROLL TO TOP --- */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 bg-gray-900 hover:bg-black text-white p-3 rounded-full shadow-2xl transition-all"
        >
          <ArrowUp size={20} />
        </button>
      )}

      {/* --- HEADER --- */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Admin Overview
        </h1>
        <p className="text-gray-500 mt-1">
          Monitoring school performance and activities.
        </p>
      </div>

      {/* --- DYNAMIC STATS CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {dynamicStats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">
                    {stat.value.toLocaleString()}
                  </p>
                </div>
                <div
                  className={`${stat.color} p-4 rounded-xl text-white shadow-lg shadow-gray-200 group-hover:scale-110 transition-transform`}
                >
                  <Icon size={24} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs font-medium text-emerald-600">
                <TrendingUp size={14} className="mr-1" />
                <span>+ Live Data</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* --- PERFORMANCE & EVENTS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-blue-500" />
            Performance Analytics
          </h2>
          <div className="h-64 flex items-end justify-around gap-3">
            {performanceData.map((height, idx) => (
              <div
                key={idx}
                className="flex-1 flex flex-col items-center group relative"
              >
                <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-[10px] px-2 py-1 rounded">
                  {height}%
                </div>
                <div
                  className="w-full bg-blue-50 rounded-t-lg group-hover:bg-blue-500 transition-colors duration-300"
                  style={{ height: `${height}%` }}
                ></div>
                <span className="text-[10px] text-gray-400 mt-3 font-semibold uppercase">
                  D{idx + 1}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-800">Events</h2>
            <Calendar className="text-blue-500" size={20} />
          </div>
          <div className="space-y-4">
            {upcomingEvents.map((event, idx) => (
              <div
                key={idx}
                className="flex gap-4 items-center p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
              >
                <div className="bg-blue-50 text-blue-600 h-12 w-12 rounded-lg flex flex-col items-center justify-center shrink-0">
                  <span className="text-xs font-bold uppercase">
                    {event.date.split(" ")[0]}
                  </span>
                  <span className="text-sm font-extrabold">{idx + 10}</span>
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-sm">
                    {event.name}
                  </p>
                  <p className="text-xs text-gray-500">{event.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- ACTIVITY & QUICK ACTIONS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-800">Recent Activity</h2>
            <Bell className="text-amber-500" size={20} />
          </div>
          <div className="space-y-1">
            {recentActivities.map((activity, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-all border-b border-gray-50 last:border-0"
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    activity.type === "success"
                      ? "bg-emerald-500"
                      : "bg-blue-500"
                  }`}
                ></div>
                <div className="flex-1">
                  <p className="text-gray-700 font-semibold text-sm">
                    {activity.title}
                  </p>
                  <p className="text-[11px] text-gray-400 font-medium uppercase tracking-tight">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-2">Quick Actions</h2>
            <p className="text-slate-400 mb-8 text-sm">
              Streamline your management workflow.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <QuickActionBtn Icon={TrendingUp} label="Reports" />
              <QuickActionBtn Icon={Users} label="Add Student" />
              <QuickActionBtn Icon={Calendar} label="Events" />
              <QuickActionBtn Icon={Award} label="Awards" />
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        </div>
      </div>
    </div>
  );
};

const QuickActionBtn = ({ Icon, label }) => (
  <button className="bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-4 transition-all flex flex-col items-center gap-2 group">
    <Icon
      size={22}
      className="text-blue-400 group-hover:scale-110 transition-transform"
    />
    <span className="text-xs font-bold tracking-wide">{label}</span>
  </button>
);

export default Dashboard;
