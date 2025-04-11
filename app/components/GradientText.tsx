import React from 'react';

interface GradientTextProps {
  text: string;
  className?: string;
}

const GradientText: React.FC<GradientTextProps> = ({ text, className = '' }) => {
  return (
    <span className={`bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 bg-clip-text text-transparent ${className}`}>
      {text}
    </span>
  );
};

export default GradientText; 