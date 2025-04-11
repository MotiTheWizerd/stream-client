'use client';
// components/CategoryList.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Music, Code, Palette, Utensils, Dumbbell, Heart, Globe, Trophy, Radio } from 'lucide-react';
import GradientContainer from './ui/GradientContainer';

// Define the category interface
interface Category {
  id: number;
  name: string;
  icon: React.ReactNode;
  color: string;
  viewers: string;
  channels: number;
}

// Define the keyframe animation styles in a separate global CSS file instead of styled-jsx
// We'll use Tailwind's built-in animation utilities and add custom ones in globals.css

const CategoryList = () => {
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
  const [flashingCategories, setFlashingCategories] = useState<number[]>([]); // Array to track multiple flashing instances
  const flashingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Define categories with their respective icons and colors
  const categories: Category[] = [
    {
      id: 1,
      name: "Gaming",
      icon: <Gamepad2 size={24} />,
      color: "from-violet-500 to-purple-600",
      viewers: "1.2M",
      channels: 8453
    },
    {
      id: 2,
      name: "Music",
      icon: <Music size={24} />,
      color: "from-pink-500 to-rose-600",
      viewers: "845K",
      channels: 5672
    },
    {
      id: 3,
      name: "Programming",
      icon: <Code size={24} />,
      color: "from-blue-500 to-cyan-600",
      viewers: "560K",
      channels: 3241
    },
    {
      id: 4,
      name: "Art",
      icon: <Palette size={24} />,
      color: "from-amber-500 to-orange-600",
      viewers: "390K",
      channels: 2184
    },
    {
      id: 5,
      name: "Cooking",
      icon: <Utensils size={24} />,
      color: "from-red-500 to-rose-600",
      viewers: "275K",
      channels: 1562
    },
    {
      id: 6,
      name: "Fitness",
      icon: <Dumbbell size={24} />,
      color: "from-emerald-500 to-teal-600",
      viewers: "320K",
      channels: 1890
    },
    {
      id: 7,
      name: "IRL",
      icon: <Heart size={24} />,
      color: "from-pink-500 to-purple-600",
      viewers: "680K",
      channels: 4350
    },
    {
      id: 8,
      name: "Travel",
      icon: <Globe size={24} />,
      color: "from-blue-500 to-indigo-600",
      viewers: "410K",
      channels: 2731
    },
    {
      id: 9,
      name: "Esports",
      icon: <Trophy size={24} />,
      color: "from-yellow-500 to-amber-600",
      viewers: "935K",
      channels: 1283
    },
    {
      id: 10,
      name: "Talk Shows",
      icon: <Radio size={24} />,
      color: "from-purple-500 to-indigo-600",
      viewers: "1.4M",
      channels: 9254
    }
  ];

  // Effect to trigger random flashing effects periodically
  useEffect(() => {
    const triggerRandomFlash = () => {
      // Generate a random category id, ensuring it's not already flashing
      let availableCategories = categories
        .filter(cat => !flashingCategories.includes(cat.id))
        .map(cat => cat.id);
      
      // If all categories are flashing or no categories available, just pick any random one
      if (availableCategories.length === 0) {
        availableCategories = categories.map(cat => cat.id);
      }
      
      const randomIndex = Math.floor(Math.random() * availableCategories.length);
      const randomId = availableCategories[randomIndex];
      
      // Add new flashing category
      setFlashingCategories(prev => [...prev, randomId]);
      
      // Remove flashing effect after animation completes
      setTimeout(() => {
        setFlashingCategories(prev => prev.filter(id => id !== randomId));
      }, 1500);
    };
    
    // Set interval for random flashing effect (every 2-5 seconds)
    const setRandomInterval = () => {
      // Clear any existing timer
      if (flashingTimerRef.current) {
        clearTimeout(flashingTimerRef.current);
      }
      
      // Random time between 2-5 seconds (reduced from 5-10)
      const randomTime = Math.floor(Math.random() * 3000) + 2000;
      
      flashingTimerRef.current = setTimeout(() => {
        triggerRandomFlash();
        setRandomInterval(); // Set next interval
      }, randomTime);
    };
    
    // Start the random interval
    setRandomInterval();
    
    // Clean up on component unmount
    return () => {
      if (flashingTimerRef.current) {
        clearTimeout(flashingTimerRef.current);
      }
    };
  }, [categories, flashingCategories]);

  return (
    <GradientContainer variant="green" className="py-10 px-6">
      {/* Section header with visual effects */}
      <div className="relative mb-8 flex items-center">
        <div className="h-8 w-1.5 bg-gradient-to-b from-emerald-500 to-teal-400 rounded-full mr-3"></div>
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300">
          Browse Categories
        </h2>
        <div className="ml-3 bg-emerald-900/50 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-emerald-300 flex items-center border border-emerald-700/50">
          <Globe size={12} className="mr-1 text-emerald-400 animate-pulse" />
          <span>Discover</span>
        </div>
      </div>
      
      {/* Categories grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {categories.map((category) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: category.id * 0.05 }}
            onMouseEnter={() => setHoveredCategory(category.id)}
            onMouseLeave={() => setHoveredCategory(null)}
            className="group relative cursor-pointer"
          >
            {/* Category card */}
            <div className="relative overflow-hidden rounded-xl bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 transition-all duration-500 h-full
              hover:shadow-lg hover:shadow-emerald-500/20 hover:border-emerald-500/50">
              
              {/* Glowing border effect on hover */}
              <div className={`absolute inset-0 rounded-xl transition-opacity duration-300 z-0 ${
                hoveredCategory === category.id ? 'opacity-100' : 'opacity-0'
              }`}>
                <div className="absolute inset-0 rounded-xl border border-emerald-500/70 shadow-[0_0_15px_rgba(16,185,129,0.3)]"></div>
              </div>
              
              {/* Flashing effect animation - updated to check array of flashing categories */}
              <div className={`absolute inset-0 z-20 rounded-xl overflow-hidden pointer-events-none`}>
  {flashingCategories.includes(category.id) && (
    <div className="animate-flash-diagonal"></div>
  )}
</div>
              
              {/* Category content container */}
              <div className="relative z-10 p-4 flex flex-col items-center">
                {/* Icon with background gradient */}
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.color} mb-3 flex items-center justify-center text-white
                  transform transition-all duration-500 ${hoveredCategory === category.id ? 'scale-110 shadow-lg' : 'scale-100'}`}>
                  {category.icon}
                </div>
                
                {/* Category name with hover effect */}
                <h3 className="font-semibold text-center text-white group-hover:text-emerald-300 transition-colors duration-300">
                  {category.name}
                </h3>
                
                {/* Stats with reveal animation */}
                <div className={`mt-2 flex items-center justify-center space-x-3 transition-all duration-500 ${
                  hoveredCategory === category.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}>
                  <span className="text-xs text-emerald-400">{category.viewers} viewers</span>
                  <span className="w-1 h-1 rounded-full bg-gray-500"></span>
                  <span className="text-xs text-gray-400">{category.channels} channels</span>
                </div>
              </div>
              
              {/* Animated gradient bar at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-700">
                <div className={`h-full bg-gradient-to-r ${category.color} transition-all duration-500 ${
                  hoveredCategory === category.id ? 'w-full' : 'w-0'
                }`}></div>
              </div>
            </div>
            
            {/* Particle effect on hover */}
            <div className={`absolute -inset-2 z-0 transition-opacity duration-300 ${
              hoveredCategory === category.id ? 'opacity-70' : 'opacity-0'
            }`}>
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-br from-emerald-500/30 to-transparent rounded-full blur-xl animate-pulse"></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* View more button */}
      <div className="flex justify-center mt-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium 
            transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/30 backdrop-blur-sm"
        >
          View All Categories
        </motion.button>
      </div>
    </GradientContainer>
  );
};

export default CategoryList;