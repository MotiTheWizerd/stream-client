"use client";
import React, { useState, useEffect } from "react";
import { Send, X } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAppSelector } from "@/lib/redux/hooks";

interface ComposeMessageProps {
  recipientId?: string;
  onClose?: () => void;
  isModal?: boolean;
  returnPath?: string;
}

const ComposeMessage = ({
  recipientId,
  onClose,
  isModal = false,
  returnPath = "/messages",
}: ComposeMessageProps) => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [recipient, setRecipient] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingRecipient, setIsLoadingRecipient] = useState(false);

  const router = useRouter();
  const { token } = useAppSelector((state) => state.user);

  const apiBaseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "";

  useEffect(() => {
    if (recipientId) {
      fetchRecipientDetails();
    }
  }, [recipientId]);

  const fetchRecipientDetails = async () => {
    if (!recipientId || !token) return;

    setIsLoadingRecipient(true);
    try {
      if (!apiBaseUrl) {
        throw new Error("API Base URL not configured");
      }
      const response = await fetch(`${apiBaseUrl}/api/users/${recipientId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch recipient details");
      }

      const data = await response.json();
      setRecipient(data);
    } catch (error) {
      console.error("Error fetching recipient details:", error);
      toast.error("Could not load recipient details");
    } finally {
      setIsLoadingRecipient(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!subject.trim() || !message.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!recipientId) {
      toast.error("No recipient specified");
      return;
    }

    setIsLoading(true);
    try {
      if (!apiBaseUrl) {
        throw new Error("API Base URL not configured");
      }
      const response = await fetch(`${apiBaseUrl}/api/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          recipientId,
          subject,
          content: message,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send message");
      }

      toast.success("Message sent successfully");
      setSubject("");
      setMessage("");

      if (isModal && onClose) {
        onClose();
      } else {
        router.push(returnPath);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to send message"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`bg-gray-800 rounded-lg shadow-xl ${isModal ? "p-6" : "p-8"}`}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">
          {isLoadingRecipient
            ? "Loading..."
            : recipient
            ? `Message to ${recipient.username}`
            : "New Message"}
        </h2>
        {isModal && onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="subject"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Subject
          </label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
            placeholder="Enter subject"
            disabled={isLoading}
          />
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Message
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition resize-none"
            placeholder="Type your message here..."
            disabled={isLoading}
          />
        </div>

        <div className="flex justify-end">
          {isModal && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg mr-3 hover:bg-gray-600 transition"
              disabled={isLoading}
            >
              Cancel
            </button>
          )}

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg flex items-center transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || isLoadingRecipient}
          >
            {isLoading ? (
              <span className="inline-block h-5 w-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></span>
            ) : (
              <Send size={18} className="mr-2" />
            )}
            Send Message
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default ComposeMessage;
