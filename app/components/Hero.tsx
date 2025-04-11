// components/Hero.tsx
"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Users, Star, Clock, ChevronRight } from "lucide-react";

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate loading of assets
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative overflow-hidden rounded-xl h-[600px] flex items-center mb-12">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/30 to-black z-0"></div>

      {/* Particle effect overlay */}
      <div className="absolute inset-0 z-[1] opacity-30">
        <div className="absolute w-full h-full bg-particle-pattern animate-particle-flow"></div>
      </div>

      {/* Animated gradient borders */}
      <div className="absolute inset-0 rounded-xl p-[2px] z-[2] overflow-hidden">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-purple-500/30 animate-gradient-flow"></div>
      </div>

      {/* Main background image with effects */}
      <motion.div
        className="absolute inset-0 z-[3]"
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: isLoaded ? 0.6 : 0, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <img
          src="/hero.jpeg" // Replace with your featured stream image
          alt="Featured Stream"
          className="w-full h-full object-cover"
        />
        {/* Advanced overlay with multiple gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/70 to-gray-900/50"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent"></div>

        {/* Animated spotlight effect */}
        <div className="absolute inset-0 bg-radial-spotlight opacity-40 animate-pulse-slow"></div>
      </motion.div>

      {/* Floating animated elements */}
      <div className="absolute top-20 right-20 w-24 h-24 rounded-full bg-purple-600/20 blur-2xl animate-float-slow z-[3]"></div>
      <div className="absolute bottom-20 left-40 w-32 h-32 rounded-full bg-pink-600/20 blur-2xl animate-float-slow-reverse z-[3]"></div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 flex items-center h-full">
        <motion.div
          className="max-w-2xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {/* Live badge */}
          <motion.div
            className="inline-flex items-center bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <span className="w-2 h-2 bg-white rounded-full mr-2 animate-ping-slow"></span>
            <span>LIVE NOW</span>
          </motion.div>

          {/* Stream Title with gradient text */}
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-300 to-white">
              Epic Gaming Showdown
            </span>
          </h1>

          {/* Stream Description */}
          <p className="text-xl text-gray-300 mb-8 font-light max-w-xl">
            Join top streamers as they battle it out in the ultimate gaming
            tournament. Don't miss the action!
          </p>

          {/* Stream stats */}
          <div className="flex items-center space-x-6 mb-8">
            <div className="flex items-center text-purple-300">
              <Users size={18} className="mr-2" />
              <span className="font-medium">15.2K watching</span>
            </div>
            <div className="flex items-center text-purple-300">
              <Clock size={18} className="mr-2" />
              <span className="font-medium">Started 2h ago</span>
            </div>
            <div className="flex items-center text-purple-300">
              <Star size={18} className="mr-2" fill="#d8b4fe" />
              <span className="font-medium">Featured Stream</span>
            </div>
          </div>

          {/* Streamer Info with animated card */}
          <motion.div
            className="flex items-center mb-8 bg-white/5 backdrop-blur-lg p-3 rounded-xl border border-white/10 w-fit"
            whileHover={{
              scale: 1.03,
              backgroundColor: "rgba(255,255,255,0.08)",
            }}
            transition={{ duration: 0.2 }}
          >
            <div className="relative">
              <img
                src="/hero.jpeg" // Replace with streamer avatar
                alt="Streamer"
                className="w-12 h-12 rounded-full mr-3 ring-2 ring-purple-500"
              />
              <div className="absolute -bottom-1 -right-[-7px] bg-purple-600 rounded-full p-1">
                <Star size={10} fill="white" />
              </div>
            </div>
            <div>
              <div className="font-bold text-white">StreamerName</div>
              <div className="text-sm text-gray-400">
                Professional Esports Player
              </div>
            </div>
          </motion.div>

          {/* Call to Action */}
          <div className="flex flex-wrap space-x-4">
            <motion.button
              className="group relative bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 rounded-lg font-bold transition-all duration-300 overflow-hidden"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 20px rgba(168, 85, 247, 0.5)",
              }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 transform group-hover:scale-[1.5] group-hover:opacity-0"></span>
              <span className="absolute inset-0 w-0 h-full bg-gradient-to-r from-pink-600 to-purple-600 transition-all duration-700 ease-out group-hover:w-full"></span>
              <span className="relative flex items-center">
                <Play size={18} fill="white" className="mr-2" />
                Watch Now
              </span>
            </motion.button>

            <motion.button
              className="group relative bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 px-6 py-4 rounded-lg font-semibold transition-colors flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>Follow Streamer</span>
              <ChevronRight
                size={18}
                className="ml-1 transform transition-transform group-hover:translate-x-1"
              />
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* CSS for custom animations */}
      <style jsx>{`
        @keyframes particle-flow {
          0% {
            transform: translateY(0) translateX(0);
          }
          100% {
            transform: translateY(-100px) translateX(100px);
          }
        }
        .animate-particle-flow {
          animation: particle-flow 20s linear infinite;
        }

        @keyframes gradient-flow {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .animate-gradient-flow {
          animation: gradient-flow 15s linear infinite;
        }

        @keyframes float-slow {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-15px);
          }
          100% {
            transform: translateY(0);
          }
        }
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }

        @keyframes float-slow-reverse {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(15px);
          }
          100% {
            transform: translateY(0);
          }
        }
        .animate-float-slow-reverse {
          animation: float-slow-reverse 9s ease-in-out infinite;
        }

        @keyframes ping-slow {
          0% {
            transform: scale(0.8);
            opacity: 1;
          }
          50% {
            transform: scale(1.5);
            opacity: 0.8;
          }
          100% {
            transform: scale(0.8);
            opacity: 1;
          }
        }
        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        @keyframes pulse-slow {
          0% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            opacity: 0.3;
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .bg-particle-pattern {
          background-image: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.15) 1px,
            transparent 1px
          );
          background-size: 30px 30px;
        }

        .bg-radial-spotlight {
          background: radial-gradient(
            circle at 70% 20%,
            rgba(168, 85, 247, 0.4) 0%,
            transparent 50%
          );
        }
      `}</style>
    </section>
  );
};

export default Hero;
