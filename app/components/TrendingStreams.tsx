// components/TrendingStreams.tsx
"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Eye,
  Flame,
  Award,
  Star,
  TrendingUp,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import UserAvatar, { User } from "./UserAvatar";
import { getAvatar } from "../../lib/utils/userUtils";
import { testUsers } from "../../dev/utils/testUsers";

// Define the StreamInfo interface for better typing
interface StreamInfo {
  id: number;
  title: string;
  streamer: string;
  streamerId: string;
  thumbnail: string;
  viewers: number;
  category: string;
  tags: string[];
  isHot: boolean;
  isRising: boolean;
}

const TrendingStreams = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // User IDs to randomly select from
const userIds = testUsers.map((user: User) => user.id!);

  // Function to get a consistent user ID based on stream position
  const getConsistentUserId = (streamId: number): string => {
    const index = streamId % userIds.length;
    return userIds[index] ?? testUsers[0]!.id!;
  };

const userIdToUsername = new Map(
  testUsers.map((user) => [user.id!, user.username])
);
// Sample data - you would use your actual data source
  const trendingStreams: StreamInfo[] = [
    {
      id: 1,
      title: "Competitive CSGO Matches",
streamer: userIdToUsername.get(getConsistentUserId(1)!),
streamerId: getConsistentUserId(1)!,
      thumbnail: "/fake-stream-1.jpg",
      viewers: 1234,
      category: "CS:GO",
      tags: ["FPS", "Competitive", "ESL"],
      isHot: true,
      isRising: false,
    },
    {
      id: 2,
      title: "First Playthrough - Elden Ring",
streamer: userIdToUsername.get(getConsistentUserId(2)!),
      streamerId: getConsistentUserId(2)!,
      thumbnail: "/fake-stream-2.jpg",
      viewers: 856,
      category: "Elden Ring",
      tags: ["RPG", "Souls-like"],
      isHot: false,
      isRising: true,
    },
    {
      id: 3,
      title: "World Record Attempts",
streamer: userIdToUsername.get(getConsistentUserId(3)!),
      streamerId: getConsistentUserId(3)!,
      thumbnail: "/fake-stream-3.jpg",
      viewers: 2100,
      category: "Portal 2",
      tags: ["Speedrun", "WR Attempt"],
      isHot: true,
      isRising: false,
    },
    {
      id: 4,
      title: "Building Medieval Castle - Day 3",
streamer: userIdToUsername.get(getConsistentUserId(4)!),
      streamerId: getConsistentUserId(4)!,
      thumbnail: "/fake-stream-4.jpg",
      viewers: 945,
      category: "Minecraft",
      tags: ["Building", "Creative", "Medieval"],
      isHot: false,
      isRising: true,
    },
    {
      id: 5,
      title: "Late Night Valorant Ranked",
streamer: userIdToUsername.get(getConsistentUserId(5)!),
streamerId: getConsistentUserId(5)!,
      thumbnail: "/fake-stream-5.jpg",
      viewers: 1576,
      category: "Valorant",
      tags: ["FPS", "Competitive", "Ranked"],
      isHot: true,
      isRising: false,
    },
    {
      id: 6,
      title: "Speedrunning Mario 64",
streamer: userIdToUsername.get(getConsistentUserId(6)!),
streamerId: getConsistentUserId(6)!,
      thumbnail: "/fake-stream-6.jpg",
      viewers: 732,
      category: "Super Mario 64",
      tags: ["Speedrun", "Retro", "Nintendo"],
      isHot: false,
      isRising: true,
    },
    {
      id: 7,
      title: "Learning React & Next.js",
streamer: userIdToUsername.get(getConsistentUserId(7)!),
streamerId: getConsistentUserId(7)!,
      thumbnail: "/fake-stream-7.jpg",
      viewers: 412,
      category: "Programming",
      tags: ["Coding", "Web Dev", "Tutorial"],
      isHot: false,
      isRising: true,
    },
    {
      id: 8,
      title: "Horror Game Night",
streamer: userIdToUsername.get(getConsistentUserId(8)!),
streamerId: getConsistentUserId(8)!,
      thumbnail: "/fake-stream-8.jpg",
      viewers: 1823,
      category: "Resident Evil",
      tags: ["Horror", "Survival", "Story"],
      isHot: true,
      isRising: false,
    },
    {
      id: 9,
      title: "League of Legends Ranked",
streamer: userIdToUsername.get(getConsistentUserId(9)!),
streamerId: getConsistentUserId(9)!,
      thumbnail: "/fake-stream-9.jpg",
      viewers: 2435,
      category: "League of Legends",
      tags: ["MOBA", "Competitive", "Team Play"],
      isHot: true,
      isRising: false,
    },
    {
      id: 10,
      title: "Skyrim Modded Playthrough",
streamer: userIdToUsername.get(getConsistentUserId(10)!),
streamerId: getConsistentUserId(10)!,
      thumbnail: "/fake-stream-1.jpg",
      viewers: 754,
      category: "Skyrim",
      tags: ["RPG", "Modded", "Open World"],
      isHot: false,
      isRising: true,
    },
    {
      id: 11,
      title: "Apex Legends Tournament",
streamer: userIdToUsername.get(getConsistentUserId(11)!),
streamerId: getConsistentUserId(11)!,
      thumbnail: "/fake-stream-2.jpg",
      viewers: 3120,
      category: "Apex Legends",
      tags: ["FPS", "Battle Royale", "Tournament"],
      isHot: true,
      isRising: true,
    },
    {
      id: 12,
      title: "Minecraft SMP Adventures",
streamer: userIdToUsername.get(getConsistentUserId(12)!),
streamerId: getConsistentUserId(12)!,
      thumbnail: "/fake-stream-3.jpg",
      viewers: 865,
      category: "Minecraft",
      tags: ["Survival", "Multiplayer", "Building"],
      isHot: false,
      isRising: true,
    },
  ];

  // Calculate number of pages - updated to show 6 streams per page
  const streamsPerPage = 6;
  const totalPages = Math.ceil(trendingStreams.length / streamsPerPage);

  // Auto scroll feature
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, 8000);
    return () => clearInterval(interval);
  }, [totalPages]);

  // Next/Previous handlers
  const handleNext = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const handlePrev = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  // Get current page streams
  const getCurrentPageStreams = () => {
    const startIndex = currentPage * streamsPerPage;
    return trendingStreams.slice(startIndex, startIndex + streamsPerPage);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl py-8 px-4">
      {/* Glowing background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-indigo-900/20 to-black/10 z-0"></div>
      <div className="absolute -inset-[100px] bg-grid-pattern opacity-10 z-0 animate-grid-flow"></div>

      {/* Section header with visual effects */}
      <div className="relative mb-8 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-1.5 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            Trending Now
          </h2>
          {/* Animated badge */}
          <div className="bg-purple-900/50 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-purple-300 flex items-center border border-purple-700/50">
            <Flame size={12} className="mr-1 text-orange-500 animate-pulse" />
            <span>Hot Streams</span>
          </div>
        </div>

        {/* Page indicator */}
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-400">
            <span className="text-purple-400 font-bold">{currentPage + 1}</span>
            <span className="mx-1">/</span>
            <span>{totalPages}</span>
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrev}
              className="p-2 rounded-full bg-purple-900/50 hover:bg-purple-800/70 text-white border border-purple-700/50 backdrop-blur-sm transition-all duration-300"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={handleNext}
              className="p-2 rounded-full bg-purple-900/50 hover:bg-purple-800/70 text-white border border-purple-700/50 backdrop-blur-sm transition-all duration-300"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Streams grid with page transition - Updated to 2×3 grid (2 rows, 3 columns per row) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`page-${currentPage}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto"
        >
          <div className="flex flex-col space-y-6">
            {/* First row - 3 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <StreamCard
                key={getCurrentPageStreams()[0]?.id}
                stream={getCurrentPageStreams()[0]}
                index={0}
                hoverIndex={hoverIndex}
                setHoverIndex={setHoverIndex}
              />
              <StreamCard
                key={getCurrentPageStreams()[1]?.id}
                stream={getCurrentPageStreams()[1]}
                index={1}
                hoverIndex={hoverIndex}
                setHoverIndex={setHoverIndex}
              />
              <StreamCard
                key={getCurrentPageStreams()[2]?.id}
                stream={getCurrentPageStreams()[2]}
                index={2}
                hoverIndex={hoverIndex}
                setHoverIndex={setHoverIndex}
              />
            </div>

            {/* Second row - 3 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <StreamCard
                key={getCurrentPageStreams()[3]?.id}
                stream={getCurrentPageStreams()[3]}
                index={3}
                hoverIndex={hoverIndex}
                setHoverIndex={setHoverIndex}
              />
              <StreamCard
                key={getCurrentPageStreams()[4]?.id}
                stream={getCurrentPageStreams()[4]}
                index={4}
                hoverIndex={hoverIndex}
                setHoverIndex={setHoverIndex}
              />
              <StreamCard
                key={getCurrentPageStreams()[5]?.id}
                stream={getCurrentPageStreams()[5]}
                index={5}
                hoverIndex={hoverIndex}
                setHoverIndex={setHoverIndex}
              />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Pagination dots */}
      <div className="flex justify-center mt-8 space-x-2">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index)}
            className={`transition-all duration-300 ${
              index === currentPage
                ? "w-6 h-2 bg-purple-500 rounded-full"
                : "w-2 h-2 bg-gray-600 hover:bg-gray-500 rounded-full"
            }`}
          />
        ))}
      </div>

      {/* CSS for custom animations */}
      <style jsx>{`
        @keyframes grid-flow {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(50px);
          }
        }
        .animate-grid-flow {
          animation: grid-flow 20s linear infinite;
        }
        .bg-grid-pattern {
          background-image: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.1) 1px,
            transparent 1px
          );
          background-size: 30px 30px;
        }
      `}</style>
    </div>
  );
};

// StreamCard component with proper TypeScript typing
interface StreamCardProps {
  stream: StreamInfo;
  index: number;
  hoverIndex: number | null;
  setHoverIndex: (index: number | null) => void;
}

const StreamCard: React.FC<StreamCardProps> = ({
  stream,
  index,
  hoverIndex,
  setHoverIndex,
}) => {
  if (!stream) return null; // Safety check for when fewer than 6 streams are available

  // Create user object for UserAvatar with proper avatar URL
  const user: User = {
    id: stream.streamerId,
    username: stream.streamer,
    isOnline: true,
    avatarUrl: stream.streamerId ? getAvatar(stream.streamerId) : undefined
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseEnter={() => setHoverIndex(index)}
      onMouseLeave={() => setHoverIndex(null)}
      className="group relative bg-gray-800/80 backdrop-blur-sm rounded-xl overflow-hidden cursor-pointer hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500"
    >
      {/* Animated border glow effect */}
      <div
        className={`absolute inset-0 rounded-xl transition-opacity duration-500 z-10 pointer-events-none ${
          hoverIndex === index ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="absolute inset-0 rounded-xl border-2 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]"></div>
      </div>

      {/* Thumbnail - smaller aspect ratio */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={stream.thumbnail}
          alt={stream.title}
          className={`w-full h-full object-cover transition-all duration-700 ${
            hoverIndex === index
              ? "scale-110 filter brightness-75"
              : "scale-100"
          }`}
        />

        {/* Dark overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

        {/* Stream badges - more compact */}
        <div className="absolute top-2 left-2 flex space-x-1">
          <div className="bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full flex items-center">
            <Flame size={10} className="animate-pulse mr-0.5" />
            <span>LIVE</span>
          </div>
          {stream.isHot && (
            <div className="bg-amber-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full flex items-center">
              <Flame size={10} className="mr-0.5" />
              <span>HOT</span>
            </div>
          )}
        </div>

        {/* Viewer count */}
        <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm text-white text-xs px-1.5 py-0.5 rounded-full flex items-center">
          <Eye size={10} className="text-red-500 mr-0.5" />
          <span>{stream.viewers.toLocaleString()}</span>
        </div>

        {/* Play button overlay */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
            hoverIndex === index ? "opacity-100" : "opacity-0"
          }`}
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-full transition-all duration-300 group-hover:shadow-lg group-hover:shadow-purple-500/30"
          >
            <Play size={20} fill="white" />
          </motion.button>
        </div>
      </div>

      {/* Stream Info - more compact */}
      <div className="p-3 relative">
        {/* Animated background on hover */}
        <div
          className={`absolute -inset-px bg-gradient-to-r from-purple-600/20 to-transparent rounded-b-xl transition-opacity duration-500 ${
            hoverIndex === index ? "opacity-100" : "opacity-0"
          }`}
        ></div>

        <div className="relative">
          {/* Stream title and streamer in one row */}
          <div className="flex items-center mb-1">
            <UserAvatar
              user={user}
              size="xs"
              showStatus={true}
              showUsername={true}
              textPosition="below"
              className="mr-1.5"
            />
            <h3 className="font-semibold text-white text-sm line-clamp-1 group-hover:text-purple-300 transition-colors duration-300">
              {stream.title}
            </h3>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-xs">{stream.category}</p>
          </div>

          {/* Tags - simplified */}
          <div className="flex flex-wrap gap-1 mt-1">
            {stream.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-[10px] bg-gray-700/80 hover:bg-purple-700/50 px-1.5 py-0.5 rounded-full text-gray-300 hover:text-purple-200 transition-colors duration-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Animated progress bar at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-700">
          <div
            className={`h-full bg-purple-600 transition-all duration-500 ${
              hoverIndex === index ? "w-full" : "w-0"
            }`}
          ></div>
        </div>
      </div>
    </motion.div>
  );
};

export default TrendingStreams;
