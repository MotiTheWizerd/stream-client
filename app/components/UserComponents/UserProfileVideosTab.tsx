"use client";
import React from "react";
import { motion } from "framer-motion";
import { PlayCircle } from "lucide-react";
import liveChannels from "@/data/liveChannels"; // Make sure this path is correct

interface Channel {
  id: string;
  title: string;
  thumbnail: string;
  viewers: number;
  game: string;
  username: string;
}

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
    },
  }),
};

const UserProfileVideosTab = () => {
  // TODO: Fetch user-specific videos instead of liveChannels
  const videos: Channel[] = liveChannels; // Using placeholder data

  return (
    <motion.div
      // initial="hidden" // Temporarily removed for diagnostics
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {videos.map((channel, i) => (
        <motion.div
          key={channel.id}
          // custom={i} // Temporarily removed for diagnostics
          className="group"
        >
          <motion.div
            // whileHover={{
            //   y: -8,
            //   rotateY: 5,
            //   transition: { duration: 0.4 },
            // }} // Temporarily removed for diagnostics
            className="relative aspect-video bg-gradient-to-br from-gray-800 via-gray-800 to-purple-900/40 rounded-xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-purple-500/30 transform perspective-1000"
          >
            <div className="absolute inset-[1px] rounded-[10px] overflow-hidden">
              <img
                src={channel.thumbnail}
                alt={channel.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/90 via-gray-900/40 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/30 opacity-0 group-hover:opacity-30 mix-blend-overlay transition-opacity duration-500"></div>

            {/* Glass effect elements */}

            {/* Live badge with glow */}
            {/* You might want to conditionally render this based on video type */}
            <div className="absolute top-3 left-3">
              <div className="px-3 py-1.5 rounded-lg text-xs font-medium flex items-center bg-gradient-to-r from-red-600 to-red-500 shadow-lg shadow-red-500/30">
                <span className="w-2 h-2 bg-white rounded-full mr-1.5 animate-pulse"></span>
                LIVE {/* Or VOD? */}
              </div>
            </div>

            <div className="absolute bottom-3 left-3 bg-black/50 px-3 py-1.5 rounded-lg text-xs font-medium backdrop-blur-sm border border-white/10">
              {channel.viewers.toLocaleString()} viewers
            </div>

            {/* Play button with glow effect */}
            <motion.div
              // whileHover={{
              //   scale: 1.15,
              //   transition: { duration: 0.2 },
              // }} // Temporarily removed for diagnostics
              // initial={{ opacity: 0, scale: 0.8 }} // Temporarily removed for diagnostics
              // animate={{ opacity: 1, scale: 1 }} // Temporarily removed for diagnostics
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl shadow-purple-500/50">
                <PlayCircle className="text-white" size={32} />
              </div>
            </motion.div>
          </motion.div>

          {/* Card info with enhanced styling */}
          <div className="mt-3 text-white">
            <motion.h3
              // whileHover={{ x: 3 }} // Temporarily removed for diagnostics
              className="text-white font-medium truncate text-lg"
            >
              {channel.title}
            </motion.h3>
            <motion.div className="flex items-center mt-1.5">
              <span className="text-purple-400 text-sm mr-2">
                {channel.game}
              </span>
              <span className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded-full">
                {channel.username}
              </span>
            </motion.div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default UserProfileVideosTab;
