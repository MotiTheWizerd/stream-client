"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface PrivatePostPlaceholderProps {
  authorUsername: string;
}

const PrivatePostPlaceholder: React.FC<PrivatePostPlaceholderProps> = ({
  authorUsername,
}) => {
  const router = useRouter();

  const handleSubscribeClick = () => {
    router.push("/subscribe");
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center p-8 mb-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div className="text-center">
        <motion.div
          className="text-4xl mb-3"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            damping: 10,
            stiffness: 300,
          }}
        >
          🔒
        </motion.div>
        <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 mb-2">
          For Subscribers Only
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          Subscribe to {authorUsername} to view this exclusive content
        </p>
        <motion.button
          className="mt-4 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          // TODO: Implement subscribe action
          onClick={handleSubscribeClick}
        >
          Subscribe Now
        </motion.button>
      </div>
    </motion.div>
  );
};

export default PrivatePostPlaceholder;
