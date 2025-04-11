"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Inbox, Send, Trash2, RefreshCw, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/redux/hooks";
import toast from "react-hot-toast";

interface Message {
  id: string;
  subject: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  senderId: string;
  recipientId: string;
  sender?: {
    id: string;
    username: string;
    avatar: string;
  };
  recipient?: {
    id: string;
    username: string;
    avatar: string;
  };
}

interface MessageInboxProps {
  onMessageSelect?: (messageId: string) => void; // Optional callback for custom message selection
}

const MessageInbox = ({ onMessageSelect }: MessageInboxProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"inbox" | "sent">("inbox");

  const router = useRouter();
  const { token, user } = useAppSelector((state) => state.user);

  const apiBaseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "";

  useEffect(() => {
    if (token) {
      fetchMessages();
    }
  }, [token, activeTab]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      if (!apiBaseUrl) {
        throw new Error("API Base URL not configured");
      }
      const endpoint = activeTab === "inbox" ? "inbox" : "sent";
      const response = await fetch(`${apiBaseUrl}/api/messages/${endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }

      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error(`Error fetching ${activeTab} messages:`, error);
      toast.error(`Could not load ${activeTab} messages`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      if (!apiBaseUrl) {
        throw new Error("API Base URL not configured");
      }
      const response = await fetch(`${apiBaseUrl}/api/messages/${messageId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete message");
      }

      // Remove deleted message from the state
      setMessages(messages.filter((msg) => msg.id !== messageId));
      toast.success("Message deleted successfully");
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error("Failed to delete message");
    }
  };

  const handleViewMessage = (messageId: string) => {
    if (onMessageSelect) {
      onMessageSelect(messageId);
    } else {
      router.push(`/messages/${messageId}`);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Messages</h2>
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/messages/compose")}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center hover:bg-purple-700 transition"
          >
            <MessageSquare size={18} className="mr-2" />
            New Message
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchMessages}
            className="p-2 bg-gray-700 text-white rounded-lg flex items-center hover:bg-gray-600 transition"
            title="Refresh"
          >
            <RefreshCw size={18} />
          </motion.button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700 mb-6">
        <button
          onClick={() => setActiveTab("inbox")}
          className={`flex items-center px-4 py-2 ${
            activeTab === "inbox"
              ? "text-purple-400 border-b-2 border-purple-400"
              : "text-gray-400 hover:text-white"
          } transition-colors`}
        >
          <Inbox size={18} className="mr-2" />
          Inbox
        </button>
        <button
          onClick={() => setActiveTab("sent")}
          className={`flex items-center px-4 py-2 ${
            activeTab === "sent"
              ? "text-purple-400 border-b-2 border-purple-400"
              : "text-gray-400 hover:text-white"
          } transition-colors`}
        >
          <Send size={18} className="mr-2" />
          Sent
        </button>
      </div>

      {/* Messages List */}
      {loading ? (
        <div className="flex justify-center py-10">
          <span className="inline-block h-8 w-8 border-t-2 border-b-2 border-purple-500 rounded-full animate-spin"></span>
        </div>
      ) : messages.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-400">No messages to display</p>
        </div>
      ) : (
        <div className="space-y-2">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`p-4 rounded-lg border transition-colors cursor-pointer ${
                activeTab === "inbox" && !message.isRead
                  ? "bg-gray-700/70 border-purple-500/50"
                  : "bg-gray-700/30 border-gray-700 hover:bg-gray-700/50"
              }`}
            >
              <div className="flex items-start justify-between">
                <div
                  className="flex-grow"
                  onClick={() => handleViewMessage(message.id)}
                >
                  <div className="flex items-center">
                    <h3
                      className={`font-medium text-lg ${
                        activeTab === "inbox" && !message.isRead
                          ? "text-white"
                          : "text-gray-300"
                      }`}
                    >
                      {message.subject}
                    </h3>
                    {activeTab === "inbox" && !message.isRead && (
                      <span className="ml-2 w-2 h-2 bg-purple-500 rounded-full"></span>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm">
                    {activeTab === "inbox" ? "From: " : "To: "}
                    <span className="text-gray-300">
                      {activeTab === "inbox"
                        ? message.sender?.username
                        : message.recipient?.username}
                    </span>
                  </p>
                  <div className="text-gray-400 text-sm mt-1">
                    {formatDate(message.createdAt)}
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteMessage(message.id)}
                  className="text-gray-400 hover:text-red-500 p-1"
                  title="Delete message"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessageInbox;
