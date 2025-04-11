"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  X,
  MessageSquare,
  UserPlus,
  Info,
  Trash2,
  CheckCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/redux/hooks";
import toast from "react-hot-toast";
import { format } from "date-fns";

interface Notification {
  id: string;
  type: "MESSAGE" | "FOLLOW" | "SYSTEM";
  content: string;
  isRead: boolean;
  createdAt: string;
  sourceId: string | null;
  actorId: string | null;
}

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const { token, isAuthenticated } = useAppSelector((state) => state.user);

  const apiBaseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "";

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch notifications when dropdown is opened
  useEffect(() => {
    if (isOpen && isAuthenticated && token) {
      fetchNotifications();
    }
  }, [isOpen, isAuthenticated, token]);

  // Periodically fetch unread count
  useEffect(() => {
    if (isAuthenticated && token) {
      fetchUnreadCount();

      const interval = setInterval(() => {
        fetchUnreadCount();
      }, 30000); // Check every 30 seconds

      return () => clearInterval(interval);
    }
  }, [isAuthenticated, token]);

  const fetchNotifications = async () => {
    if (!token) return;

    setIsLoading(true);
    try {
      if (!apiBaseUrl) {
        throw new Error("API Base URL not configured");
      }
      const response = await fetch(`${apiBaseUrl}/api/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }

      const data = await response.json();
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    if (!token) return;

    try {
      if (!apiBaseUrl) {
        throw new Error("API Base URL not configured");
      }
      const response = await fetch(
        `${apiBaseUrl}/api/notifications/unread-count`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch unread count");
      }

      const data = await response.json();
      setUnreadCount(data.unreadCount);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  const markAllAsRead = async () => {
    if (!token) return;

    try {
      if (!apiBaseUrl) {
        throw new Error("API Base URL not configured");
      }
      const response = await fetch(
        `${apiBaseUrl}/api/notifications/mark-all-read`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to mark notifications as read");
      }

      // Update local state
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, isRead: true }))
      );
      setUnreadCount(0);

      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Error marking notifications as read:", error);
      toast.error("Failed to mark notifications as read");
    }
  };

  const handleClearAll = async () => {
    if (!token) return;

    // Add confirmation dialog before clearing all notifications
    if (!window.confirm("Are you sure you want to clear all notifications?")) {
      return;
    }

    try {
      if (!apiBaseUrl) {
        throw new Error("API Base URL not configured");
      }
      const response = await fetch(`${apiBaseUrl}/api/notifications`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to clear notifications");
      }

      // Update local state
      setNotifications([]);
      setUnreadCount(0);

      toast.success("All notifications cleared");
    } catch (error) {
      console.error("Error clearing notifications:", error);
      toast.error("Failed to clear notifications");
    }
  };

  const handleDelete = async (notificationId: string) => {
    if (!token) return;

    // Add confirmation dialog before deleting
    if (!window.confirm("Are you sure you want to delete this notification?")) {
      return;
    }

    try {
      if (!apiBaseUrl) {
        throw new Error("API Base URL not configured");
      }
      const response = await fetch(
        `${apiBaseUrl}/api/notifications/${notificationId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete notification");
      }

      // Update local state
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));

      // If the deleted notification was unread, update the count
      const deletedNotification = notifications.find(
        (n) => n.id === notificationId
      );
      if (
        deletedNotification &&
        !deletedNotification.isRead &&
        unreadCount > 0
      ) {
        setUnreadCount((prev) => prev - 1);
      }

      toast.success("Notification deleted");
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Failed to delete notification");
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!token) return;

    try {
      // Mark the notification as read
      if (!notification.isRead) {
        if (!apiBaseUrl) {
          throw new Error("API Base URL not configured");
        }
        await fetch(`${apiBaseUrl}/api/notifications/${notification.id}/read`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Update local state
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notification.id ? { ...n, isRead: true } : n
          )
        );

        if (unreadCount > 0) {
          setUnreadCount((prev) => prev - 1);
        }
      }

      // Navigate based on notification type
      if (notification.type === "MESSAGE" && notification.sourceId) {
        router.push(`/messages/${notification.sourceId}`);
      } else if (notification.type === "FOLLOW" && notification.actorId) {
        console.log("Navigating to follower profile:", notification.actorId);
        toast.success(
          `Checking out ${notification.content.split(" ")[1]}'s profile!`
        );
        router.push(`/user-profile/${notification.actorId}`);
      }

      setIsOpen(false);
    } catch (error) {
      console.error("Error handling notification click:", error);
      toast.error("Failed to process notification");
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "MESSAGE":
        return <MessageSquare size={18} className="text-blue-400" />;
      case "FOLLOW":
        return (
          <div className="relative">
            <UserPlus size={18} className="text-green-400" />
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-green-400 rounded-full animate-pulse"></span>
          </div>
        );
      case "SYSTEM":
      default:
        return <Info size={18} className="text-purple-400" />;
    }
  };

  const formatTimestamp = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, h:mm a");
    } catch (error) {
      return "Unknown date";
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-300 hover:text-white transition-colors relative"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50 border border-gray-700"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">
                Notifications
              </h3>
              <div className="flex space-x-2">
                {notifications.length > 0 && (
                  <>
                    <button
                      onClick={markAllAsRead}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                      title="Mark all as read"
                    >
                      <CheckCircle size={16} />
                    </button>
                    <button
                      onClick={handleClearAll}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                      title="Clear all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <span className="inline-block h-6 w-6 border-t-2 border-b-2 border-purple-500 rounded-full animate-spin"></span>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-400">
                  No notifications to display
                </div>
              ) : (
                <div>
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-gray-700 hover:bg-gray-700/50 transition-colors cursor-pointer relative group ${
                        !notification.isRead ? "bg-gray-700/30" : ""
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start">
                        <div className="shrink-0 mr-3 mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-grow pr-6">
                          {notification.type === "FOLLOW" ? (
                            <p
                              className={`text-sm ${
                                !notification.isRead
                                  ? "text-white font-semibold"
                                  : "text-gray-300"
                              }`}
                            >
                              <span className="text-base">
                                {notification.content.split(" ")[0]}
                              </span>{" "}
                              <span className="font-bold text-green-400">
                                {notification.content.split(" ")[1]}
                              </span>{" "}
                              {notification.content
                                .split(" ")
                                .slice(2)
                                .join(" ")}
                            </p>
                          ) : (
                            <p
                              className={`text-sm ${
                                !notification.isRead
                                  ? "text-white"
                                  : "text-gray-300"
                              }`}
                            >
                              {notification.content}
                            </p>
                          )}
                          <p className="text-xs text-gray-400 mt-1">
                            {formatTimestamp(notification.createdAt)}
                          </p>
                        </div>
                        {!notification.isRead && (
                          <span className="absolute top-4 right-4 h-2 w-2 bg-blue-500 rounded-full"></span>
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(notification.id);
                        }}
                        className="absolute right-3 top-3 p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-gray-700 transition-all opacity-0 group-hover:opacity-100 hover:opacity-100 z-10"
                        title="Delete notification"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationDropdown;
