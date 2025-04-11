"use client";
import React from "react";
import { motion } from "framer-motion";

interface UserProfileAboutTabProps {
  name: string;
  bio: string;
}

const UserProfileAboutTab = ({ name, bio }: UserProfileAboutTabProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 shadow-lg max-w-3xl mx-auto"
    >
      <h3 className="text-xl font-semibold text-white mb-4">About {name}</h3>
      <p className="text-gray-300 leading-relaxed">{bio}</p>
    </motion.div>
  );
};

export default UserProfileAboutTab;
