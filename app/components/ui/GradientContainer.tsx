"use client";
import React, { ReactNode } from 'react';

interface GradientContainerProps {
  children: ReactNode;
  className?: string;
  variant?: 'purple' | 'blue' | 'green';
}

const GradientContainer: React.FC<GradientContainerProps> = ({ 
  children, 
  className = '', 
  variant = 'purple' 
}) => {
  // Define gradient variations
  const gradientVariants = {
    purple: "from-purple-900/30 via-indigo-900/20 to-black/10",
    blue: "from-blue-900/30 via-indigo-900/20 to-black/10",
    green: "from-emerald-900/30 via-teal-900/20 to-black/10"
  };
  
  const selectedGradient = gradientVariants[variant];
  
  return (
    <div className={`relative overflow-hidden rounded-2xl py-8 px-4 ${className}`}>
      {/* Glowing background effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${selectedGradient} z-0`}></div>
      <div className="absolute -inset-[100px] bg-grid-pattern opacity-10 z-0 animate-grid-flow"></div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* CSS for custom animations */}
      <style jsx>{`
        @keyframes grid-flow {
          0% { transform: translateY(0); }
          100% { transform: translateY(50px); }
        }
        .animate-grid-flow {
          animation: grid-flow 20s linear infinite;
        }
        .bg-grid-pattern {
          background-image: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
          background-size: 30px 30px;
        }
      `}</style>
    </div>
  );
};

export default GradientContainer; 