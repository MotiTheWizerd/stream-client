"use client";
import React from 'react';
import { motion } from 'framer-motion';

const UserProfileLoading = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-white flex flex-col items-center"
      >
        <div className="w-10 h-10 border-t-2 border-purple-500 rounded-full animate-spin mb-4"></div>
        <span className="text-purple-300">Loading profile...</span>
      </motion.div>
    </div>
  );
};

export default UserProfileLoading; 