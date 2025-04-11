"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ComposeMessage from "@/components/Messages/ComposeMessage";
import { useAppSelector } from "@/lib/redux/hooks";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

const ComposeMessagePage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.user);

  const recipientId = searchParams.get("recipient");
  const returnPath = searchParams.get("returnPath") || "/messages";

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
          <div className="flex items-center mb-6">
            <button
              onClick={() => router.push(returnPath)}
              className="text-gray-400 hover:text-white transition-colors flex items-center"
            >
              <ArrowLeft size={18} className="mr-2" />
              Back to messages
            </button>
          </div>

          <h1 className="text-3xl font-bold text-white mb-6">
            Compose Message
          </h1>

          <ComposeMessage
            recipientId={recipientId || undefined}
            returnPath={returnPath}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default ComposeMessagePage;
