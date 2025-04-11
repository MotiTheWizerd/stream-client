"use client";
import React from "react";
import { motion } from "framer-motion";

interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface UserProfileTabsProps {
  tabs: Tab[];
  activeTab: string;
  setActiveTab: (tabId: string) => void;
}

const UserProfileTabs = ({
  tabs,
  activeTab,
  setActiveTab,
}: UserProfileTabsProps) => {
  return (
    <div className="mt-8">
      <motion.nav
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="relative flex justify-center"
      >
        <div className="bg-gray-900/60 backdrop-blur-md rounded-xl border border-gray-800/50 p-1.5 shadow-lg">
          <div className="flex space-x-1">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative py-2.5 px-5 text-sm font-medium transition-all rounded-lg flex items-center justify-center ${
                  activeTab === tab.id
                    ? "text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                }`}
                whileHover={activeTab !== tab.id ? { scale: 1.03 } : {}}
                whileTap={activeTab !== tab.id ? { scale: 0.97 } : {}}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTabBg"
                    className="absolute inset-0 bg-gradient-to-r from-purple-600/90 to-indigo-600/90 rounded-lg shadow-lg"
                    initial={false}
                    transition={{ type: "spring", damping: 20 }}
                  />
                )}
                <span
                  className={`relative mr-2 ${
                    activeTab === tab.id ? "text-white" : ""
                  }`}
                >
                  {tab.icon}
                </span>
                <span className="relative">{tab.label}</span>

                {/* Notification Badge (for demo, can be dynamic) */}
                {tab.id === "notifications" && (
                  <span className="ml-1.5 relative flex h-5 w-5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-5 w-5 bg-purple-600 justify-center items-center text-[10px] font-bold">
                      3
                    </span>
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.nav>

      {/* Decorative Elements */}
      <div className="relative z-0 mt-4 mb-6 flex justify-center">
        <div className="absolute top-0 h-px w-3/4 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"></div>
      </div>
    </div>
  );
};

export default UserProfileTabs;
