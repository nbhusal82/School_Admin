import React from "react"; // React import check garnu hos
import { useNavigate } from "react-router-dom"; // Logout pachi navigate garna
import {
  Users,
  BookOpen,
  Calendar,
  TrendingUp,
  Award,
  Bell,
  LogOut,
} from "lucide-react"; // LogOut icon thapeko
import {
  dashboardStats,
  recentActivities,
  upcomingEvents,
  performanceData,
} from "../../../data/data";

const Dashboard = () => {
  const navigate = useNavigate();
  const iconMap = { Users, BookOpen, Calendar, Award };

  const stats = dashboardStats.map((stat) => ({
    ...stat,
    icon: iconMap[stat.icon],
  }));

  // Logout Function
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      // Yaha localstorage clear garne logic rakhnu hola (e.g., localStorage.removeItem('token'))
      navigate("/");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen relative">
      {/* --- LOGOUT BUTTON (TOP RIGHT FIXED) --- */}
      <div className="fixed top-6 right-6 z-50">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg transition-all font-semibold active:scale-95"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg shadow-inner`}>
                  <Icon className="text-white" size={24} />
                </div>
                <span className="text-green-600 text-sm font-semibold bg-green-50 px-2 py-1 rounded-md">
                  {stat.change}
                </span>
              </div>
              <h3 className="text-gray-600 text-sm uppercase tracking-wider">
                {stat.label}
              </h3>
              <p className="text-3xl font-bold text-gray-800 mt-1">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* CHARTS & EVENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Performance Overview
          </h2>
          <div className="h-64 flex items-end justify-around gap-4 pt-4">
            {performanceData.map((height, idx) => (
              <div
                key={idx}
                className="flex-1 flex flex-col items-center group"
              >
                <div
                  className="w-full bg-blue-500 rounded-t-lg group-hover:bg-blue-600 transition-all shadow-sm"
                  style={{ height: `${height}%` }}
                ></div>
                <span className="text-[10px] text-gray-500 mt-2 font-medium">
                  Day {idx + 1}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Upcoming Events</h2>
            <Calendar className="text-blue-500" size={20} />
          </div>
          <div className="space-y-4">
            {upcomingEvents.map((event, idx) => (
              <div
                key={idx}
                className="border-l-4 border-blue-500 pl-4 py-2 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <p className="font-semibold text-gray-800">{event.name}</p>
                <p className="text-sm text-gray-600">{event.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ACTIVITIES & QUICK ACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Recent Activity</h2>
            <Bell className="text-blue-500" size={20} />
          </div>
          <div className="space-y-3">
            {recentActivities.map((activity, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors border-b last:border-0"
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full mt-2 shrink-0 ${activity.type === "success" ? "bg-green-500" : activity.type === "info" ? "bg-blue-500" : "bg-purple-500"}`}
                ></div>
                <div className="flex-1">
                  <p className="text-gray-800 font-medium text-sm">
                    {activity.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-linear-to-br from-blue-600 to-purple-700 rounded-xl shadow-lg p-6 text-white overflow-hidden relative">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-1">Quick Actions</h2>
            <p className="text-blue-100 mb-6 text-sm">
              Manage your school efficiently
            </p>
            <div className="grid grid-cols-2 gap-4">
              <QuickActionBtn Icon={TrendingUp} label="View Reports" />
              <QuickActionBtn Icon={Users} label="Add Student" />
              <QuickActionBtn Icon={Calendar} label="Schedule Event" />
              <QuickActionBtn Icon={Award} label="Add Achievement" />
            </div>
          </div>
          {/* Decorative Circle */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        </div>
      </div>
    </div>
  );
};

// Sub-component for Quick Actions
const QuickActionBtn = ({ Icon, label }) => (
  <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-xl p-4 transition-all flex flex-col items-center justify-center gap-2 group">
    <Icon size={24} className="group-hover:scale-110 transition-transform" />
    <p className="text-xs font-semibold">{label}</p>
  </button>
);

export default Dashboard;
