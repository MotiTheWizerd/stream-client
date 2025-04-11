"use client";
import React from "react";
import { MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface MessageButtonProps {
  recipientId: string;
  className?: string;
  returnPath?: string;
}

const MessageButton = ({
  recipientId,
  className = "",
  returnPath,
}: MessageButtonProps) => {
  const router = useRouter();

  const handleClick = () => {
    let url = `/messages/compose?recipient=${recipientId}`;
    if (returnPath) {
      url += `&returnPath=${encodeURIComponent(returnPath)}`;
    }
    router.push(url);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className={`px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-full transition flex items-center border border-gray-700 shadow-lg ${className}`}
    >
      <MessageSquare size={18} className="mr-2" />
      Message
    </motion.button>
  );
};

export default MessageButton;
