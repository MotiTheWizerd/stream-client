"use client";
import React from "react";
import MessageInbox from "@/components/Messages/MessageInbox";
import { useAppSelector } from "@/lib/redux/hooks";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const MessagesPage = () => {
  const { isAuthenticated } = useAppSelector((state) => state.user);
  const router = useRouter();

  // Redirect to login if not authenticated
  React.useEffect(() => {
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
          <h1 className="text-3xl font-bold text-white mb-6">Messages</h1>
          <MessageInbox />
        </motion.div>
      </div>
    </div>
  );
};

export default MessagesPage; 