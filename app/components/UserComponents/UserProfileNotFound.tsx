"use client";
import React from "react";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { useRouter } from "next/navigation";

const UserProfileNotFound = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 rounded-xl p-8 max-w-md text-center shadow-2xl border border-gray-700"
      >
        <div className="mb-4 text-gray-400">
          <Users size={48} className="mx-auto mb-2 opacity-50" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">User Not Found</h2>
        <p className="text-gray-400 mb-6">
          This profile doesn't exist or may have been removed.
        </p>
        <button
          onClick={() => router.push("/")}
          className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full transition w-full"
        >
          Return Home
        </button>
      </motion.div>
    </div>
  );
};

export default UserProfileNotFound;
