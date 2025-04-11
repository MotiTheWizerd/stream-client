"use client";
import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import MessageDetail from "@/components/Messages/MessageDetail";
import { useAppSelector } from "@/lib/redux/hooks";
import { motion } from "framer-motion";

interface MessageDetailPageProps {
  params: {
    id: string;
  };
}

const MessageDetailPage = ({ params }: MessageDetailPageProps) => {
  const messageId = params.id;
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.user);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-white flex flex-col items-center"
        >
          <div className="w-10 h-10 border-t-2 border-purple-500 rounded-full animate-spin mb-4"></div>
          <span className="text-purple-300">Checking authentication...</span>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col p-4 md:p-8">
      <div className="max-w-4xl w-full mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <MessageDetail messageId={messageId} returnPath="/messages" />
        </motion.div>
      </div>
    </div>
  );
};

export default MessageDetailPage;
