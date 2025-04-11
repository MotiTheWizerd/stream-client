"use client";

import { useState } from "react";
import {
  Users,
  FileText,
  TrendingUp,
  DollarSign,
  Bell,
  MoreHorizontal,
} from "lucide-react";

// Card component for dashboard statistics
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard = ({ title, value, icon, trend }: StatCardProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            {title}
          </p>
          <h3 className="text-2xl font-bold mt-1 dark:text-white">{value}</h3>
          {trend && (
            <div className="flex items-center mt-2">
              <span
                className={`text-xs font-medium ${
                  trend.isPositive ? "text-green-500" : "text-red-500"
                }`}
              >
                {trend.isPositive ? "+" : ""}
                {trend.value}%
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                vs last month
              </span>
            </div>
          )}
        </div>
        <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
          {icon}
        </div>
      </div>
    </div>
  );
};

// Recent activity component
interface ActivityItem {
  id: string;
  user: string;
  action: string;
  time: string;
}

const RecentActivity = ({ activities }: { activities: ActivityItem[] }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold dark:text-white">Recent Activity</h3>
        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <MoreHorizontal size={20} />
        </button>
      </div>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-3 pb-4 border-b border-gray-100 dark:border-gray-700"
          >
            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-full">
              <Bell size={16} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm dark:text-gray-200">
                <span className="font-medium">{activity.user}</span>{" "}
                {activity.action}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {activity.time}
              </p>
            </div>
          </div>
        ))}
      </div>
      <button className="w-full mt-4 py-2 text-sm text-blue-600 dark:text-blue-400 font-medium hover:text-blue-800 dark:hover:text-blue-300">
        View all activity
      </button>
    </div>
  );
};

export default function AdminDashboard() {
  const [activities] = useState<ActivityItem[]>([
    {
      id: "1",
      user: "John Doe",
      action: "created a new post",
      time: "10 minutes ago",
    },
    {
      id: "2",
      user: "Jane Smith",
      action: "updated their profile",
      time: "1 hour ago",
    },
    { id: "3", user: "Alex Johnson", action: "went live", time: "3 hours ago" },
    {
      id: "4",
      user: "Sarah Williams",
      action: "created a new post",
      time: "5 hours ago",
    },
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Welcome to your admin dashboard
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value="3,721"
          icon={
            <Users size={20} className="text-blue-600 dark:text-blue-400" />
          }
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Active Content"
          value="843"
          icon={
            <FileText size={20} className="text-blue-600 dark:text-blue-400" />
          }
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Daily Views"
          value="15.2K"
          icon={
            <TrendingUp
              size={20}
              className="text-blue-600 dark:text-blue-400"
            />
          }
          trend={{ value: 2, isPositive: false }}
        />
        <StatCard
          title="Revenue"
          value="$12,428"
          icon={
            <DollarSign
              size={20}
              className="text-blue-600 dark:text-blue-400"
            />
          }
          trend={{ value: 10, isPositive: true }}
        />
      </div>

      {/* Activity section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold dark:text-white">Traffic Overview</h3>
            <select className="p-2 text-sm border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 dark:text-gray-200">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg">
            {/* Placeholder for chart - Would use a charting library in real implementation */}
            <p className="text-gray-400 dark:text-gray-500">
              Traffic analytics chart goes here
            </p>
          </div>
        </div>
        <div>
          <RecentActivity activities={activities} />
        </div>
      </div>
    </div>
  );
}
