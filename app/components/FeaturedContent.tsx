"use client";
// components/FeaturedContent.tsx
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Eye,
  ChevronRight,
  ChevronLeft,
  Star,
  Flame,
  Clock,
} from "lucide-react";
import GradientContainer from "./ui/GradientContainer";
import UserAvatar, { User } from "./UserAvatar";

// Define interfaces for better typing
interface FeaturedItem {
  id: number;
  title: string;
  streamer: string;
  streamerId: string;
  viewers: string;
  thumbnail: string;
  duration?: string;
  tags?: string[];
  category?: string;
  rating?: number;
  isTrending?: boolean;
}

const FeaturedContent = () => {
  // User IDs to randomly select from
  const userIds = [
    "121e5205-b149-429c-88c6-117063c836e9",
    "c84a269e-a5ea-40f5-9e26-7e9b5e0794b5",
    "66bf5a52-3dc2-43d0-96ae-a663eac27cfa",
  ];

  // Initialize featured items with stable user IDs
  const featuredItems: FeaturedItem[] = [
    {
      id: 1,
      title: "Epic Night Stream",
streamer: "user 2",
      streamerId: "121e5205-b149-429c-88c6-117063c836e9",
      viewers: "12.5k",
      thumbnail: "/fake-stream-1.jpg",
      duration: "3:45:20",
      tags: ["Gaming", "Adventure"],
      category: "Action RPG",
      rating: 4.8,
      isTrending: true,
    },
    {
      id: 2,
      title: "Music Live Mix",
streamer: "user 1",
      streamerId: "c84a269e-a5ea-40f5-9e26-7e9b5e0794b5",
      viewers: "8.3k",
      thumbnail: "/fake-stream-2.jpg",
      duration: "2:15:10",
      tags: ["Music", "Electronic"],
      category: "DJ Set",
      rating: 4.5,
      isTrending: true,
    },
    {
      id: 3,
      title: "Art Creation Live",
streamer: "user 3",
      streamerId: "66bf5a52-3dc2-43d0-96ae-a663eac27cfa",
      viewers: "5.1k",
      thumbnail: "/fake-stream-3.jpg",
      duration: "1:30:45",
      tags: ["Art", "Digital"],
      category: "Digital Art",
      rating: 4.6,
    },
    {
      id: 4,
      title: "Tech Talk",
streamer: "user 2",
      streamerId: "121e5205-b149-429c-88c6-117063c836e9",
      viewers: "7.8k",
      thumbnail: "/fake-stream-4.jpg",
      duration: "1:15:30",
      tags: ["Tech", "Coding"],
      category: "Programming",
      rating: 4.7,
      isTrending: true,
    },
    {
      id: 5,
      title: "Cooking Show",
streamer: "user 1",
      streamerId: "c84a269e-a5ea-40f5-9e26-7e9b5e0794b5",
      viewers: "9.2k",
      thumbnail: "/fake-stream-5.jpg",
      duration: "1:45:00",
      tags: ["Food", "Cooking"],
      category: "Culinary",
      rating: 4.9,
    },
    {
      id: 6,
      title: "Fitness Challenge",
streamer: "user 3",
      streamerId: "66bf5a52-3dc2-43d0-96ae-a663eac27cfa",
      viewers: "6.4k",
      thumbnail: "/fake-stream-6.jpg",
      duration: "0:55:15",
      tags: ["Fitness", "Workout"],
      category: "Health",
      rating: 4.4,
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [autoplay, setAutoplay] = useState(true);
  const itemsPerView = 3;
  const totalItems = featuredItems.length;

  // Auto-scroll functionality
  useEffect(() => {
    if (!autoplay) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % featuredItems.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [autoplay, featuredItems.length]);

  // Pause autoplay on hover
  const handleMouseEnter = () => setAutoplay(false);
  const handleMouseLeave = () => setAutoplay(true);

  // Navigation handlers
  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + totalItems) % totalItems);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % totalItems);
  };

  // Calculate visible items
  const getVisibleItems = () => {
    const result = [];
    for (let i = 0; i < itemsPerView; i++) {
      const index = (activeIndex + i) % totalItems;
      result.push(featuredItems[index]);
    }
    return result;
  };

  return (
    <GradientContainer variant="blue" className="py-10 px-6">
      {/* Section header with visual elements */}
      <div className="relative mb-8 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-1.5 bg-gradient-to-b from-blue-500 to-cyan-400 rounded-full"></div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
            Featured Content
          </h2>
          {/* Animated tag */}
          <div className="bg-blue-900/50 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-blue-300 flex items-center border border-blue-700/50">
            <Star
              size={12}
              className="mr-1 text-yellow-500 animate-[pulse_2s_ease-in-out_infinite]"
            />
            <span>Top Picks</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrev}
            className="p-2 rounded-full bg-blue-900/50 hover:bg-blue-800/70 text-white border border-blue-700/50 backdrop-blur-sm transition-all duration-300"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={handleNext}
            className="p-2 rounded-full bg-blue-900/50 hover:bg-blue-800/70 text-white border border-blue-700/50 backdrop-blur-sm transition-all duration-300"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Carousel */}
      <div
        className="relative overflow-hidden"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`carousel-${activeIndex}`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {getVisibleItems().map((item, index) => (
              <FeaturedCard
                key={`featured-${item.id}-${index}`}
                item={item}
                index={index}
                isHovered={hoveredIndex === index}
                onHover={() => setHoveredIndex(index)}
                onLeave={() => setHoveredIndex(null)}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination indicators */}
      <div className="flex justify-center mt-8 space-x-2">
        {Array.from({ length: totalItems }).map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`transition-all duration-300 ${
              index === activeIndex
                ? "w-6 h-2 bg-blue-500 rounded-full"
                : "w-2 h-2 bg-gray-600 hover:bg-gray-500 rounded-full"
            }`}
          />
        ))}
      </div>
    </GradientContainer>
  );
};

// Featured Card Component
interface FeaturedCardProps {
  item: FeaturedItem;
  index: number;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}

const FeaturedCard: React.FC<FeaturedCardProps> = ({
  item,
  index,
  isHovered,
  onHover,
  onLeave,
}) => {
  // Create user object for UserAvatar with stable avatar URL
  const user: User = {
    id: item.streamerId,
    username: item.streamer,
    isOnline: true,
    avatarUrl: `/users/images/${item.streamerId}/user_avatar.jpeg`
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className="group relative bg-gray-800/80 backdrop-blur-sm rounded-xl overflow-hidden cursor-pointer hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500"
    >
      {/* Animated border glow effect */}
      <div
        className={`absolute inset-0 rounded-xl transition-opacity duration-500 z-10 pointer-events-none ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="absolute inset-0 rounded-xl border-2 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
      </div>

      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={item.thumbnail}
          alt={item.title}
          className={`w-full h-full object-cover transition-all duration-700 ${
            isHovered ? "scale-110 filter brightness-75" : "scale-100"
          }`}
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

        {/* Badges & info */}
        <div className="absolute top-2 left-2 flex space-x-1">
          <div className="bg-blue-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full flex items-center">
            <Eye size={10} className="mr-0.5" />
            <span>{item.viewers}</span>
          </div>
          {item.isTrending && (
            <div className="bg-amber-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full flex items-center">
              <Flame size={10} className="mr-0.5" />
              <span>TRENDING</span>
            </div>
          )}
        </div>

        {/* Duration */}
        <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm text-white text-xs px-1.5 py-0.5 rounded-full flex items-center">
          <Clock size={10} className="text-blue-400 mr-0.5" />
          <span>{item.duration}</span>
        </div>

        {/* Play button overlay */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-500/30"
          >
            <Play size={24} fill="white" />
          </motion.button>
        </div>
      </div>

      {/* Content Information */}
      <div className="p-3 relative">
        {/* Animated background on hover */}
        <div
          className={`absolute -inset-px bg-gradient-to-r from-blue-600/20 to-transparent rounded-b-xl transition-opacity duration-500 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        ></div>

        <div className="relative">
          {/* Title & creator */}
          <div className="flex flex-col mb-1">
            <div className="flex items-start space-x-2">
              <UserAvatar 
                user={user} 
                size="xs" 
                showStatus={true} 
                showUsername={true}
                textPosition="below"
              />
              <h3 className="font-semibold text-white text-sm line-clamp-1 group-hover:text-blue-300 transition-colors duration-300 flex-1">
                {item.title}
              </h3>
            </div>
          </div>

          {/* Category & rating */}
          <div className="flex items-center justify-between mt-1">
            <p className="text-gray-400 text-xs">{item.category}</p>
            <div className="flex items-center">
              <Star size={10} className="text-yellow-400 mr-0.5" />
              <span className="text-gray-300 text-xs">{item.rating}</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mt-2">
            {item.tags?.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-[10px] bg-gray-700/80 hover:bg-blue-700/50 px-1.5 py-0.5 rounded-full text-gray-300 hover:text-blue-200 transition-colors duration-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Animated progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-700">
          <div
            className={`h-full bg-blue-600 transition-all duration-500 ${
              isHovered ? "w-full" : "w-0"
            }`}
          ></div>
        </div>
      </div>
    </motion.div>
  );
};

export default FeaturedContent;
