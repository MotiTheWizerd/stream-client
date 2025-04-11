"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import MessageInbox from "@/components/Messages/MessageInbox";
import MessageDetail from "@/components/Messages/MessageDetail";
import { useAppSelector } from "@/lib/redux/hooks";
import { useRouter } from "next/navigation";

interface UserProfileMessagesTabProps {
  userId: string;
}

const UserProfileMessagesTab = ({ userId }: UserProfileMessagesTabProps) => {
  const { user, token, isAuthenticated } = useAppSelector(
    (state) => state.user
  );
  const router = useRouter();
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  
  // Function to handle message selection
  const handleMessageSelect = (messageId: string) => {
    setSelectedMessageId(messageId);
  };
  
  // Function to go back to the message list
  const handleBackToList = () => {
    setSelectedMessageId(null);
  };

  // If not authenticated or not viewing own profile, show message
  if (!isAuthenticated || user?.id !== userId) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/50 rounded-xl p-8 text-center"
      >
        <h3 className="text-xl font-semibold text-white mb-3">
          Messages are private
        </h3>
        <p className="text-gray-400 mb-6">
          You can only view your own messages.
        </p>
        {!isAuthenticated && (
          <button
            onClick={() => router.push("/login")}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Log in to view messages
          </button>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-2"
    >
      {selectedMessageId ? (
        <MessageDetail 
          messageId={selectedMessageId} 
          returnPath="#" // Use "#" to prevent actual navigation
          onBackClick={handleBackToList} // Pass custom back handler
        />
      ) : (
        <MessageInbox onMessageSelect={handleMessageSelect} />
      )}
    </motion.div>
  );
};

export default UserProfileMessagesTab;
