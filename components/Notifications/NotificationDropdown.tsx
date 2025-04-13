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

    // If notification is unread, mark it as read
    if (!notification.isRead) {
      try {
        if (!apiBaseUrl) {
          throw new Error("API Base URL not configured");
        }
        const response = await fetch(
          `${apiBaseUrl}/api/notifications/${notification.id}/mark-read`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to mark notification as read");
        }

        // Update local state
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notification.id ? { ...n, isRead: true } : n
          )
        );
        if (unreadCount > 0) {
          setUnreadCount((prev) => prev - 1);
        }
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    }

    // Handle navigation based on notification type
    switch (notification.type) {
      case "MESSAGE":
        if (notification.sourceId) {
          router.push(`/messages?chatId=${notification.sourceId}`);
          setIsOpen(false);
        }
        break;
      case "FOLLOW":
        if (notification.actorId) {
          router.push(`/profile/${notification.actorId}`);
          setIsOpen(false);
        }
        break;
      // Handle other notification types as needed
    }
  };

  // Helper function to get appropriate icon for notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "MESSAGE":
        return <MessageSquare className="text-blue-500" size={18} />;
      case "FOLLOW":
        return <UserPlus className="text-green-500" size={18} />;
      case "SYSTEM":
        return <Info className="text-purple-500" size={18} />;
      default:
        return <Info className="text-gray-500" size={18} />;
    }
  };

  // Format the timestamp relative to now
  const formatTimestamp = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "MMM d, h:mm a");
    } catch (error) {
      return "Invalid date";
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Button */}
      <button
        className="relative p-2 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Notifications
              </h3>
              <div className="flex space-x-2">
                {notifications.length > 0 && (
                  <>
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      disabled={unreadCount === 0}
                    >
                      Mark all as read
                    </button>
                    <button
                      onClick={handleClearAll}
                      className="text-xs text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Clear all
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Notification List */}
            <div className="max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="flex justify-center items-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                  <p>No notifications</p>
                </div>
              ) : (
                <ul>
                  {notifications.map((notification) => (
                    <li
                      key={notification.id}
                      className={`border-b border-gray-200 dark:border-gray-700 last:border-b-0 ${
                        !notification.isRead
                          ? "bg-blue-50 dark:bg-blue-900/20"
                          : ""
                      }`}
                    >
                      <div className="flex px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        {/* Icon column */}
                        <div className="flex-shrink-0 mr-3 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>

                        {/* Content column */}
                        <div
                          className="flex-1 cursor-pointer"
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div
                            className={`text-sm ${
                              !notification.isRead
                                ? "font-semibold text-gray-900 dark:text-white"
                                : "text-gray-800 dark:text-gray-200"
                            }`}
                          >
                            {notification.content}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {formatTimestamp(notification.createdAt)}
                          </div>
                        </div>

                        {/* Actions column */}
                        <div className="flex-shrink-0 ml-2 flex items-start">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(notification.id);
                            }}
                            className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 p-1"
                            aria-label="Delete notification"
                          >
                            <Trash2 size={16} />
                          </button>
                          {!notification.isRead && (
                            <div className="h-2 w-2 rounded-full bg-blue-500 ml-1"></div>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer with view all link */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-3 text-center">
              <button
                onClick={() => {
                  router.push("/notifications");
                  setIsOpen(false);
                }}
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                View all notifications
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationDropdown;
