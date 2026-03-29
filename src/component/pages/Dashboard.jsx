import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Users,
  Calendar,
  TrendingUp,
  Bell,
  LogOut,
  ArrowUp,
  UserCheck,
  FileText,
  Image,
  Newspaper,
  ChevronRight,
} from "lucide-react";
import {
  useGetDashboardStatsQuery,
  useLogoutMutation,
} from "../redux/feature/authslice";
import { logout as logoutAction } from "../redux/feature/authState";
import DashboardSkeleton from "../shared/Skeleton_Dashboard";
import ConfirmDialog from "../shared/ConfirmDialog";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: statsData, isLoading } = useGetDashboardStatsQuery();
  const [logout] = useLogoutMutation();
  const [dynamicStats, setDynamicStats] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(logoutAction());
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      dispatch(logoutAction());
      navigate("/");
    }
    setConfirmOpen(false);
  };
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

  // --- Filtered Backend Data Logic ---
  useEffect(() => {
    if (statsData?.data?.stats) {
      // 1. Defining only the keys we WANT to show
      const allowedKeys = ["teachers", "notices", "gallery", "blogs", "events"];

      const config = {
        teachers: { label: "Teachers", icon: UserCheck, color: "bg-blue-600" },
        notices: { label: "Notices", icon: FileText, color: "bg-rose-600" },
        gallery: { label: "Gallery", icon: Image, color: "bg-amber-600" },
        blogs: { label: "Blogs", icon: Newspaper, color: "bg-emerald-600" },
        events: { label: "Events", icon: Calendar, color: "bg-indigo-600" },
      };

      // 2. Filtering the API response to remove student, class, etc.
      const stats = allowedKeys
        .filter((key) => statsData.data.stats[key] !== undefined)
        .map((key) => ({
          label: config[key].label,
          value: statsData.data.stats[key],
          icon: config[key].icon,
          color: config[key].color,
        }));

      setDynamicStats(stats);
    }
  }, [statsData]);

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div className="min-h-screen bg-[#f8fafc] p-3 sm:p-6 lg:p-10 font-sans">
      {/* --- LOGOUT BUTTON (Scroll Sensitive) --- */}
      <button
        onClick={() => setConfirmOpen(true)}
        className={`fixed top-4 sm:top-6 right-4 sm:right-6 z-50 flex items-center gap-1.5 sm:gap-2 bg-white border border-gray-100 text-gray-700 hover:text-red-600 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-md transition-all duration-500 font-bold text-xs sm:text-sm
          ${showLogout ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-20"}
        `}
      >
        <LogOut size={14} className="sm:w-4 sm:h-4" />
        <span className="hidden sm:inline">Sign Out</span>
        <span className="sm:hidden">Out</span>
      </button>

      {/* --- SCROLL TO TOP --- */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 sm:bottom-8 right-6 sm:right-8 z-50 bg-slate-900 text-white p-2.5 sm:p-3.5 rounded-full shadow-2xl transition-all hover:scale-110"
        >
          <ArrowUp size={18} className="sm:w-5 sm:h-5" />
        </button>
      )}

      {/* --- HEADER --- */}
      <div className="mb-6 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">
          Admin <span className="text-blue-600 italic">Panel</span>
        </h1>
        <div className="h-1 w-16 sm:w-20 bg-blue-600 mt-1 rounded-full"></div>
      </div>

      {/* --- FILTERED STATS CARDS --- */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6 mb-6 sm:mb-10">
        {dynamicStats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-all group border-b-4 hover:border-b-blue-500"
          >
            <div
              className={`${stat.color} w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center text-white mb-3 sm:mb-4`}
            >
              <stat.icon size={16} className="sm:w-5 sm:h-5" />
            </div>
            <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] sm:tracking-[0.2em]">
              {stat.label}
            </p>
            <h3 className="text-2xl sm:text-4xl font-black text-slate-800 mt-1">
              {stat.value}
            </h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
        {/* --- RECENT ACTIVITY --- */}
        <div className="lg:col-span-2 bg-white rounded-2xl sm:rounded-4xl shadow-sm border border-slate-100 p-4 sm:p-8">
          <div className="flex items-center justify-between mb-4 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-black text-slate-800 flex items-center gap-2 sm:gap-3 underline decoration-blue-200 decoration-2 sm:decoration-4 underline-offset-4 sm:underline-offset-8">
              Recent Feed
            </h2>
            <Bell size={18} className="text-slate-300 sm:w-5 sm:h-5" />
          </div>
          <div className="space-y-2 sm:space-y-3">
            {statsData?.data?.recentActivities?.slice(0, 10).map((activity, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-transparent hover:border-slate-100 hover:bg-slate-50 transition-all group"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-[15px] text-slate-700 font-bold group-hover:text-blue-600 transition-colors truncate">
                    {activity.title}
                  </p>
                  <div className="flex items-center gap-2 sm:gap-3 mt-1 sm:mt-1.5">
                    <span className="text-[8px] sm:text-[9px] font-black uppercase bg-blue-600 text-white px-1.5 sm:px-2 py-0.5 rounded">
                      {activity.category}
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-slate-400 font-bold tracking-tight truncate">
                      {new Date(activity.created_at).toDateString()}
                    </span>
                  </div>
                </div>
                <ChevronRight
                  size={14}
                  className="text-slate-300 group-hover:translate-x-1 transition-transform shrink-0 sm:w-4 sm:h-4"
                />
              </div>
            ))}
          </div>
        </div>

        {/* --- QUICK ACTIONS --- */}
        <div className="bg-slate-900 rounded-2xl sm:rounded-4xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-lg sm:text-xl font-black mb-4 sm:mb-6 tracking-wide">Actions</h2>
            <div className="grid grid-cols-1 gap-2 sm:gap-3">
              <QuickBtn Icon={FileText} label="Post New Notice" />
              <QuickBtn Icon={Image} label="Update Gallery" />
              <QuickBtn Icon={Newspaper} label="Blog Manager" />
              <QuickBtn Icon={Calendar} label="Schedule Event" />
            </div>
          </div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"></div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleLogout}
        title="Logout?"
        message="Are you sure you want to logout from the admin panel?"
      />
    </div>
  );
};

const QuickBtn = ({ Icon, label }) => (
  <button className="w-full bg-white/5 hover:bg-white/10 border border-white/5 p-3 sm:p-4 rounded-xl sm:rounded-2xl flex items-center gap-2 sm:gap-4 transition-all group">
    <Icon
      size={16}
      className="text-blue-400 group-hover:scale-110 transition-transform sm:w-4.5 sm:h-4.5 shrink-0"
    />
    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wide sm:tracking-widest">{label}</span>
  </button>
);

export default Dashboard;
