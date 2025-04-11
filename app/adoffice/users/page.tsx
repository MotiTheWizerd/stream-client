"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  isLive: boolean;
  isOnline: boolean;
  joinedAt: string;
  lastActive: string;
}

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users] = useState<User[]>([
    {
      id: "1",
      username: "johndoe",
      email: "john@example.com",
      avatar: "https://i.pravatar.cc/150?u=1",
      isLive: false,
      isOnline: true,
      joinedAt: "2024-01-15",
      lastActive: "2 hours ago",
    },
    {
      id: "2",
      username: "janesmith",
      email: "jane@example.com",
      avatar: "https://i.pravatar.cc/150?u=2",
      isLive: true,
      isOnline: true,
      joinedAt: "2024-02-03",
      lastActive: "Just now",
    },
    {
      id: "3",
      username: "alexjohnson",
      email: "alex@example.com",
      avatar: "https://i.pravatar.cc/150?u=3",
      isLive: false,
      isOnline: false,
      joinedAt: "2023-11-22",
      lastActive: "5 days ago",
    },
    {
      id: "4",
      username: "sarahwilliams",
      email: "sarah@example.com",
      avatar: "https://i.pravatar.cc/150?u=4",
      isLive: false,
      isOnline: true,
      joinedAt: "2024-03-10",
      lastActive: "3 hours ago",
    },
    {
      id: "5",
      username: "mikebrown",
      email: "mike@example.com",
      avatar: "https://i.pravatar.cc/150?u=5",
      isLive: false,
      isOnline: false,
      joinedAt: "2023-09-15",
      lastActive: "2 weeks ago",
    },
  ]);

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold dark:text-white">Users Management</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage platform users and their permissions
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search users..."
            className="pl-10 pr-4 py-2 w-full border dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white dark:bg-gray-800 dark:text-gray-100"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300">
          <Filter size={18} />
          <span>Filters</span>
        </button>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Add New User
        </button>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Joined On
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Last Active
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredUsers.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={user.avatar}
                        alt={user.username}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {user.username}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.isOnline
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {user.isOnline ? (
                        <>
                          <CheckCircle2 size={12} className="mr-1" />
                          Online
                        </>
                      ) : (
                        <>
                          <XCircle size={12} className="mr-1" />
                          Offline
                        </>
                      )}
                    </span>
                    {user.isLive && (
                      <span className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                        Live
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {user.joinedAt}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {user.lastActive}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-4">
                    Edit
                  </button>
                  <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <MoreHorizontal size={20} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  No users found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing <span className="font-medium">1</span> to{" "}
          <span className="font-medium">5</span> of{" "}
          <span className="font-medium">50</span> users
        </div>
        <div className="flex space-x-2">
          <button className="inline-flex items-center px-4 py-2 border dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
            <ChevronLeft size={16} className="mr-1" />
            Previous
          </button>
          <button className="inline-flex items-center px-4 py-2 border dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
            Next
            <ChevronRight size={16} className="ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
