"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface UserProfileBannerProps {
  bannerUrl: string;
}

const UserProfileBanner = ({ bannerUrl }: UserProfileBannerProps) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative w-full overflow-hidden">
      {/* Banner Height with Parallax Effect */}
      <div
        className="h-[300px] sm:h-[350px] md:h-[380px] w-full relative"
        style={{
          transform: `translateY(${scrollY * 0.2}px)`,
          transition: "transform 0.1s ease-out",
        }}
      >
        {/* Animated Overlay Particles */}
        <div className="absolute inset-0 z-10 opacity-30">
          <div className="banner-particle particle-1"></div>
          <div className="banner-particle particle-2"></div>
          <div className="banner-particle particle-3"></div>
        </div>

        {/* Color Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-blue-900/40 mix-blend-multiply z-10"></div>

        {/* Banner Image with Slight Zoom Animation */}
        <motion.div
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src={bannerUrl}
            alt="Profile Banner"
            width={1920}
            height={600}
            className="w-full h-full object-cover object-center"
            priority
            quality={90}
          />
        </motion.div>

        {/* Glass Noise Texture */}
        <div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-overlay z-20"></div>

        {/* Bottom Gradient for Content Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent z-20"></div>

        {/* Top Radial Vignette */}
        <div className="absolute inset-0 bg-radial-vignette opacity-70 z-20"></div>

        {/* Interactive Glow Effect */}
        <div className="absolute inset-0 banner-glow-effect z-20 opacity-30"></div>
      </div>

      {/* Custom CSS */}
      <style jsx global>{`
        .bg-noise {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
        }

        .bg-radial-vignette {
          background: radial-gradient(circle, transparent 50%, #000 150%);
        }

        .banner-particle {
          position: absolute;
          background: linear-gradient(
            to right,
            rgba(167, 139, 250, 0.3),
            rgba(167, 139, 250, 0)
          );
          border-radius: 50%;
          filter: blur(5px);
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          animation-direction: alternate;
        }

        .particle-1 {
          width: 300px;
          height: 300px;
          left: -100px;
          top: -100px;
          animation: float-1 20s infinite;
        }

        .particle-2 {
          width: 200px;
          height: 200px;
          right: 10%;
          top: 20%;
          animation: float-2 15s infinite;
        }

        .particle-3 {
          width: 150px;
          height: 150px;
          left: 25%;
          bottom: 10%;
          animation: float-3 25s infinite;
        }

        .banner-glow-effect {
          background: radial-gradient(
            circle at var(--x, 50%) var(--y, 50%),
            rgba(139, 92, 246, 0.3) 0%,
            transparent 50%
          );
        }

        @keyframes float-1 {
          0% {
            transform: translate(0, 0) scale(1);
          }
          100% {
            transform: translate(50px, 30px) scale(1.1);
          }
        }

        @keyframes float-2 {
          0% {
            transform: translate(0, 0) rotate(0);
          }
          100% {
            transform: translate(-30px, 40px) rotate(15deg);
          }
        }

        @keyframes float-3 {
          0% {
            transform: translate(0, 0) scale(1);
          }
          100% {
            transform: translate(40px, -20px) scale(0.9);
          }
        }
      `}</style>
    </div>
  );
};

export default UserProfileBanner;
