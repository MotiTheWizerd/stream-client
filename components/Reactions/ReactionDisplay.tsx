"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ThumbsUp } from "lucide-react";
import ReactionSelector, { ReactionType, reactions } from "./ReactionSelector";

export interface ReactionDisplayProps {
  // Target information - what we're reacting to
  targetId: string;
  targetType: "Post" | "PostMediaItem" | "Comment";

  // Current state
  currentReaction: ReactionType | null;
  reactionCounts: Record<ReactionType, number>;

  // Callbacks
  onReactionSelect: (targetId: string, reaction: ReactionType | null) => void;

  // Display options
  compact?: boolean; // If true, uses a more compact display suitable for media items
  className?: string; // Additional classes for the container
}

/**
 * A reusable component for displaying reactions and reaction counts
 * Works with posts, media items, and can be extended to comments
 */
const ReactionDisplay: React.FC<ReactionDisplayProps> = ({
  targetId,
  targetType,
  currentReaction,
  reactionCounts,
  onReactionSelect,
  compact = false,
  className = "",
}) => {
  // State for reaction selector visibility
  const [isSelectorVisible, setIsSelectorVisible] = useState(false);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate total reactions
  const totalReactions = Object.values(reactionCounts).reduce(
    (sum, count) => sum + count,
    0
  );

  // Get emoji for current reaction
  const getReactionEmoji = (reactionType: ReactionType | null): string => {
    if (!reactionType) return "";
    const reaction = reactions.find((r) => r.type === reactionType);
    return reaction ? reaction.emoji : "";
  };

  // Handle showing/hiding the reaction selector
  const handleShowSelector = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    setIsSelectorVisible(true);
  };

  const handleHideSelector = () => {
    hideTimeoutRef.current = setTimeout(() => {
      setIsSelectorVisible(false);
    }, 150);
  };

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  // For compact view (used in media items)
  if (compact) {
    return (
      <div
        className={`relative ${className}`}
        onMouseEnter={handleShowSelector}
        onMouseLeave={handleHideSelector}
      >
        {/* Reaction Selector */}
        <AnimatePresence>
          {isSelectorVisible && (
            <div
              className="absolute left-2 bottom-10 z-30 flex"
              onClick={(e) => e.stopPropagation()}
            >
              <ReactionSelector
                isVisible={true}
                onSelect={(reaction) => {
                  onReactionSelect(targetId, reaction);
                  setIsSelectorVisible(false);
                }}
              />
            </div>
          )}
        </AnimatePresence>

        {/* Reaction Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onReactionSelect(targetId, currentReaction ? null : "LIKE");
            setIsSelectorVisible(false);
          }}
          className={`text-white/80 hover:text-white p-1 rounded-full ${
            currentReaction
              ? "bg-blue-500/70 hover:bg-blue-600/70"
              : "bg-black/30 hover:bg-black/50"
          } transition-colors cursor-pointer`}
          title={currentReaction ? "Change Reaction" : "React"}
        >
          {currentReaction ? (
            <>
              {getReactionEmoji(currentReaction) ? (
                <div className="flex items-center justify-center text-base">
                  {getReactionEmoji(currentReaction)}
                </div>
              ) : (
                <Heart size={16} className="fill-current text-white" />
              )}
            </>
          ) : (
            <Heart size={16} />
          )}
        </button>

        {/* Reaction Count */}
        {totalReactions > 0 && (
          <span className="text-xs text-white ml-1 font-medium">
            {totalReactions}
          </span>
        )}
      </div>
    );
  }

  // Standard view for posts (or comments)
  return (
    <div className={`flex flex-row items-center space-x-4 ${className}`}>
      {/* Reaction Summary Area - Show icons and counts */}
      <div className="flex items-center space-x-2 flex-wrap gap-y-1">
        {Object.entries(reactionCounts)
          .filter(([, count]) => count > 0)
          .map(([type, count]) => {
            const reactionInfo = reactions.find(
              (r) => r.type === (type as ReactionType)
            );
            return reactionInfo ? (
              <div
                key={type}
                className={`flex items-center px-2 py-0.5 rounded-full text-xs ${
                  currentReaction === type
                    ? "bg-blue-100 dark:bg-blue-900/50 border border-blue-300 dark:border-blue-700"
                    : "bg-gray-100 dark:bg-gray-700"
                } cursor-pointer transition-colors hover:bg-gray-200 dark:hover:bg-gray-600`}
                onClick={() =>
                  onReactionSelect(
                    targetId,
                    currentReaction === type ? null : (type as ReactionType)
                  )
                }
                title={`${count} ${reactionInfo.label}`}
              >
                <span className="mr-1 text-sm">{reactionInfo.emoji}</span>
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {count}
                </span>
              </div>
            ) : null;
          })}

        {/* Show if no reactions */}
        {totalReactions === 0 && (
          <span className="text-sm text-gray-500 dark:text-gray-400 italic">
            No reactions yet
          </span>
        )}
      </div>

      {/* Interaction Buttons Area */}
      <motion.div
        className="relative flex items-center"
        onMouseEnter={handleShowSelector}
        onMouseLeave={handleHideSelector}
      >
        {/* Reaction Selector Popup */}
        <AnimatePresence>
          {isSelectorVisible && (
            <ReactionSelector
              isVisible={isSelectorVisible}
              onSelect={(reaction) => {
                onReactionSelect(targetId, reaction);
                setIsSelectorVisible(false);
              }}
            />
          )}
        </AnimatePresence>

        {/* Basic 'React' Button */}
        <motion.button
          className={`flex items-center space-x-1 text-sm ${
            currentReaction
              ? "text-blue-600 dark:text-blue-500 font-semibold"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          } transition-colors`}
          onClick={() =>
            onReactionSelect(targetId, currentReaction ? null : "LIKE")
          }
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={currentReaction ? "Change Reaction" : "Add Reaction"}
        >
          {currentReaction ? (
            <>
              <ThumbsUp size={18} className="fill-current" />
            </>
          ) : (
            <>
              <Heart size={18} />
              <span>React</span>
            </>
          )}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default ReactionDisplay;
