"use client";
import React, { useState, useEffect } from "react";
import { ArrowLeft, Trash2, Reply } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAppSelector } from "@/lib/redux/hooks";
import UserAvatar from "@/app/components/UserAvatar";
import ComposeMessage from "./ComposeMessage";

interface MessageDetailProps {
  messageId: string;
  returnPath?: string; // Optional return path
  onBackClick?: () => void; // Optional callback for custom back navigation
}

interface Message {
  id: string;
  subject: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  senderId: string;
  recipientId: string;
  sender: {
    id: string;
    username: string;
    avatar: string;
  };
  recipient: {
    id: string;
    username: string;
    avatar: string;
  };
}

const MessageDetail = ({
  messageId,
  returnPath = "/messages",
  onBackClick,
}: MessageDetailProps) => {
  const [message, setMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReplyForm, setShowReplyForm] = useState(false);

  const router = useRouter();
  const { token, user } = useAppSelector((state) => state.user);

  const apiBaseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "";

  useEffect(() => {
    if (token && messageId) {
      fetchMessage();
    }
  }, [token, messageId]);

  const fetchMessage = async () => {
    setLoading(true);
    try {
      if (!apiBaseUrl) {
        throw new Error("API Base URL not configured");
      }
      const response = await fetch(`${apiBaseUrl}/api/messages/${messageId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          toast.error("Message not found");
          handleBack();
          return;
        }
        throw new Error("Failed to fetch message");
      }

      const data = await response.json();
      setMessage(data);
    } catch (error) {
      console.error("Error fetching message:", error);
      toast.error("Could not load message");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      router.push(returnPath);
    }
  };

  const handleDeleteMessage = async () => {
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

      toast.success("Message deleted successfully");
      handleBack();
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error("Failed to delete message");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 flex justify-center py-10">
        <span className="inline-block h-8 w-8 border-t-2 border-b-2 border-purple-500 rounded-full animate-spin"></span>
      </div>
    );
  }

  if (!message) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 text-center py-10">
        <p className="text-gray-400">Message not found</p>
      </div>
    );
  }

  const isCurrentUserSender = message.senderId === user?.id;
  const otherParty = isCurrentUserSender ? message.recipient : message.sender;

  return (
    <div className="bg-gray-800 rounded-lg shadow-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handleBack}
          className="text-gray-400 hover:text-white transition-colors flex items-center"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to messages
        </button>

        <div className="flex space-x-3">
          {!isCurrentUserSender && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center hover:bg-purple-700 transition"
            >
              <Reply size={18} className="mr-2" />
              Reply
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDeleteMessage}
            className="px-4 py-2 bg-red-600 text-white rounded-lg flex items-center hover:bg-red-700 transition"
          >
            <Trash2 size={18} className="mr-2" />
            Delete
          </motion.button>
        </div>
      </div>

      {/* Message Header */}
      <div className="border-b border-gray-700 pb-4 mb-4">
        <h2 className="text-2xl font-bold text-white mb-2">
          {message.subject}
        </h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <UserAvatar
              user={{
                id: otherParty.id,
                username: otherParty.username,
                avatarUrl: otherParty.avatar,
                isOnline: false, // We don't have this info here
              }}
              size="sm"
              showStatus={false}
            />
            <div>
              <p className="text-gray-300">
                {isCurrentUserSender ? "To: " : "From: "}
                <span className="font-medium">{otherParty.username}</span>
              </p>
              <p className="text-gray-400 text-sm">
                {formatDate(message.createdAt)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Message Content */}
      <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
        {message.content}
      </div>

      {/* Reply Form */}
      {showReplyForm && (
        <div className="mt-8 border-t border-gray-700 pt-6">
          <ComposeMessage
            recipientId={message.senderId}
            onClose={() => setShowReplyForm(false)}
            isModal={true}
          />
        </div>
      )}
    </div>
  );
};

export default MessageDetail;
