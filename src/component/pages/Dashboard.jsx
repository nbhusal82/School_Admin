import { Users, BookOpen, Calendar, TrendingUp, Award, Bell } from 'lucide-react';
import { dashboardStats, recentActivities, upcomingEvents, performanceData } from '../../../data/data';

const Dashboard = () => {
  const iconMap = { Users, BookOpen, Calendar, Award };

  const stats = dashboardStats.map(stat => ({
    ...stat,
    icon: iconMap[stat.icon]
  }));

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="text-white" size={24} />
                </div>
                <span className="text-green-600 text-sm font-semibold">{stat.change}</span>
              </div>
              <h3 className="text-gray-600 text-sm">{stat.label}</h3>
              <p className="text-3xl font-bold text-gray-800 mt-1">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Performance Overview</h2>
          <div className="h-64 flex items-end justify-around gap-4">
            {performanceData.map((height, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-linear-to-t from-blue-500 to-blue-300 rounded-t-lg hover:from-blue-600 hover:to-blue-400 transition-all" style={{ height: `${height}%` }}></div>
                <span className="text-xs text-gray-600 mt-2">Day {idx + 1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Upcoming Events</h2>
            <Calendar className="text-blue-500" size={20} />
          </div>
          <div className="space-y-4">
            {upcomingEvents.map((event, idx) => (
              <div key={idx} className="border-l-4 border-blue-500 pl-4 py-2 hover:bg-gray-50 transition-colors">
                <p className="font-semibold text-gray-800">{event.name}</p>
                <p className="text-sm text-gray-600">{event.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Recent Activity</h2>
            <Bell className="text-blue-500" size={20} />
          </div>
          <div className="space-y-3">
            {recentActivities.map((activity, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className={`w-2 h-2 rounded-full mt-2 ${activity.type === 'success' ? 'bg-green-500' : activity.type === 'info' ? 'bg-blue-500' : 'bg-purple-500'}`}></div>
                <div className="flex-1">
                  <p className="text-gray-800 font-medium">{activity.title}</p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-linear-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Quick Actions</h2>
          <p className="text-blue-100 mb-6">Manage your school efficiently</p>
          <div className="grid grid-cols-2 gap-4">
            <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg p-4 transition-all">
              <TrendingUp size={24} className="mb-2" />
              <p className="text-sm font-semibold">View Reports</p>
            </button>
            <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg p-4 transition-all">
              <Users size={24} className="mb-2" />
              <p className="text-sm font-semibold">Add Student</p>
            </button>
            <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg p-4 transition-all">
              <Calendar size={24} className="mb-2" />
              <p className="text-sm font-semibold">Schedule Event</p>
            </button>
            <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg p-4 transition-all">
              <Award size={24} className="mb-2" />
              <p className="text-sm font-semibold">Add Achievement</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
