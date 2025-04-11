"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Award,
  Check,
  X,
  Clock,
} from "lucide-react";
import toast from "react-hot-toast";
import UserAvatar from "@/app/components/UserAvatar";

interface CreatorRequest {
  id: string;
  userId: string;
  username: string;
  email: string;
  avatar: string;
  message: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
}

export default function CreatorRequestsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [requests, setRequests] = useState<CreatorRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiBaseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "";

  useEffect(() => {
    // Fetch creator requests from the API
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!apiBaseUrl) {
          throw new Error("API Base URL not configured");
        }
        const response = await fetch(
          `${apiBaseUrl}/api/users/admin/creator-requests`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch creator requests");
        }

        const data = await response.json();
        setRequests(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        console.error("Error fetching creator requests:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();

    // For development/testing only - uncomment this and comment out the fetchRequests() call if needed
    /*
    // Mock data for testing UI
    const mockRequests = [
      {
        id: "1",
        userId: "user1",
        username: "johndoe",
        email: "john@example.com",
        avatar: "https://i.pravatar.cc/150?u=1",
        message: "I want to create educational content about programming.",
        status: "PENDING" as const,
        createdAt: "2024-03-15",
      },
      {
        id: "2",
        userId: "user2",
        username: "janesmith",
        email: "jane@example.com",
        avatar: "https://i.pravatar.cc/150?u=2",
        message:
          "I'm a professional musician and would like to stream performances.",
        status: "PENDING" as const,
        createdAt: "2024-03-18",
      },
      {
        id: "3",
        userId: "user3",
        username: "alexjohnson",
        email: "alex@example.com",
        avatar: "https://i.pravatar.cc/150?u=3",
        message: "I'd like to share gaming content and tutorials.",
        status: "APPROVED" as const,
        createdAt: "2024-03-10",
      },
      {
        id: "4",
        userId: "user4",
        username: "sarahwilliams",
        email: "sarah@example.com",
        avatar: "https://i.pravatar.cc/150?u=4",
        message:
          "I'm a fitness instructor and want to stream workout sessions.",
        status: "REJECTED" as const,
        createdAt: "2024-03-05",
      },
    ];

    setTimeout(() => {
      setRequests(mockRequests);
      setLoading(false);
    }, 500);
    */
  }, []);

  const filteredRequests = requests.filter(
    (request) =>
      request.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApprove = async (requestId: string, userId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!apiBaseUrl) {
        throw new Error("API Base URL not configured");
      }
      const response = await fetch(
        `${apiBaseUrl}/api/users/admin/creator-requests/${requestId}/approve`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to approve request");
      }

      // Update local state
      setRequests(
        requests.map((req) =>
          req.id === requestId ? { ...req, status: "APPROVED" as const } : req
        )
      );

      toast.success(`Creator request approved for user ${userId}`);
    } catch (error) {
      console.error("Error approving request:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to approve request"
      );
    }
  };

  const handleReject = async (requestId: string, userId: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/users/admin/creator-requests/${requestId}/reject`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            reason: "Request rejected by admin",
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to reject request");
      }

      // Update local state
      setRequests(
        requests.map((req) =>
          req.id === requestId ? { ...req, status: "REJECTED" as const } : req
        )
      );

      toast.success(`Creator request rejected for user ${userId}`);
    } catch (error) {
      console.error("Error rejecting request:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to reject request"
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading requests...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-center">
        <p className="text-red-800 dark:text-red-400">{error}</p>
        <button
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold dark:text-white">Creator Requests</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Review and manage user requests to become content creators
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
            placeholder="Search requests..."
            className="pl-10 pr-4 py-2 w-full border dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white dark:bg-gray-800 dark:text-gray-100"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300">
          <Filter size={18} />
          <span>Filters</span>
        </button>
      </div>

      {/* Requests Table */}
      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Request Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Message
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredRequests.length > 0 ? (
              filteredRequests.map((request) => (
                <tr
                  key={request.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <UserAvatar
                      user={{
                        id: request.userId,
                        username: request.username,
                        avatarUrl: request.avatar,
                        isOnline: false,
                      }}
                      size="sm"
                      showStatus={false}
                      showUsername={true}
                      textColor="text-gray-900 dark:text-gray-100"
                      textWeight="medium"
                      email={request.email}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {request.createdAt}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                    {request.message}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        request.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                          : request.status === "APPROVED"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {request.status === "PENDING" ? (
                        <>
                          <Clock size={12} className="mr-1" />
                          Pending
                        </>
                      ) : request.status === "APPROVED" ? (
                        <>
                          <Check size={12} className="mr-1" />
                          Approved
                        </>
                      ) : (
                        <>
                          <X size={12} className="mr-1" />
                          Rejected
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {request.status === "PENDING" && (
                      <>
                        <button
                          onClick={() =>
                            handleApprove(request.id, request.userId)
                          }
                          className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 mr-3"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() =>
                            handleReject(request.id, request.userId)
                          }
                          className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {request.status !== "PENDING" && (
                      <span className="text-gray-400">Processed</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  No creator requests found.
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
          <span className="font-medium">{filteredRequests.length}</span> of{" "}
          <span className="font-medium">{requests.length}</span> requests
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
