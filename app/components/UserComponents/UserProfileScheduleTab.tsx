"use client";
import React from "react";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

const UserProfileScheduleTab = () => {
  // TODO: Fetch actual schedule data
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center py-12"
    >
      <Calendar size={48} className="mx-auto text-gray-500 mb-4" />
      <h3 className="text-xl font-semibold text-white mb-2">
        Streaming Schedule
      </h3>
      <p className="text-gray-400">Schedule information coming soon...</p>
    </motion.div>
  );
};

export default UserProfileScheduleTab;
