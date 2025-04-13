"use client";

import React from "react";
import Link from "next/link";
import { X } from "lucide-react"; // Using lucide-react for icons

interface LoginPromptPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginPromptPopup: React.FC<LoginPromptPopupProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md"
      onClick={onClose} // Close on overlay click
    >
      <div
        className="bg-neutral-100 dark:bg-neutral-900 rounded-xl shadow-lg p-6 sm:p-8 w-full max-w-lg relative transform transition-all duration-300 ease-out scale-95 opacity-0 animate-fade-in-scale border border-neutral-200 dark:border-neutral-700"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600 rounded-full p-1"
          aria-label="Close login prompt"
        >
          <X size={22} />
        </button>

        {/* Content */}
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 text-neutral-900 dark:text-neutral-100">
            Login Required
          </h2>
          <p className="text-neutral-600 dark:text-neutral-300 mb-8 text-sm sm:text-base">
            Please log in or sign up to continue.
          </p>
          {/* Button Container */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4">
            {/* Cancel Button - Removed w-full, sm:w-auto, flex-1. Added px-6, hover scale/translate. */}
            <button
              onClick={onClose}
              className="bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-neutral-800 dark:text-neutral-100 font-medium py-2.5 px-6 rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-100 dark:focus:ring-offset-neutral-900 focus:ring-neutral-400 dark:focus:ring-neutral-600 hover:brightness-105 active:scale-[0.98] hover:scale-105 hover:-translate-y-0.5"
            >
              Cancel
            </button>
            {/* Login Button Link - Update href to /auth */}
            <Link href="/auth" passHref>
              {/* Login Button */}
              <button
                onClick={onClose}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-100 dark:focus:ring-offset-neutral-900 focus:ring-blue-500 hover:brightness-105 active:scale-[0.98] shadow-md hover:shadow-lg hover:scale-105 hover:-translate-y-0.5 hover:shadow-blue-500/50"
              >
                Go to Login / Sign Up
              </button>
            </Link>
          </div>
        </div>
      </div>
      {/* Basic fade-in and scale animation */}
      <style jsx global>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in-scale {
          animation: fadeInScale 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default LoginPromptPopup;
