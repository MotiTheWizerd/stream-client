"use client";

import React from "react";
import { motion } from "framer-motion";

// Define the available reaction types (using uppercase to match Prisma enum)
export type ReactionType = "LIKE" | "LOVE" | "HAHA" | "WOW" | "SAD" | "ANGRY";

/**
 * Props for the ReactionSelector component.
 */
interface ReactionSelectorProps {
  /**
   * Callback function triggered when a reaction is selected.
   * The parent component is responsible for implementing the logic
   * (e.g., making an API call) based on the selected reaction type.
   */
  onSelect: (reaction: ReactionType) => void;
  /**
   * Controls the visibility of the reaction selector.
   */
  isVisible: boolean;
}

// Export the reactions array so it can be imported elsewhere
export const reactions: { type: ReactionType; emoji: string; label: string }[] =
  [
    { type: "LIKE", emoji: "👍", label: "Like" },
    { type: "LOVE", emoji: "❤️", label: "Love" },
    { type: "HAHA", emoji: "😂", label: "Haha" },
    { type: "WOW", emoji: "😮", label: "Wow" },
    { type: "SAD", emoji: "😢", label: "Sad" },
    { type: "ANGRY", emoji: "😠", label: "Angry" },
  ];

const containerVariants = {
  hidden: {
    opacity: 0,
    y: 10,
    scale: 0.9,
    transition: { duration: 0.15, ease: "easeOut" },
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 400,
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
  hover: {
    scale: 1.4,
    transition: { type: "spring", stiffness: 500, damping: 10 },
  },
  tap: {
    scale: 1.2,
  },
};

/**
 * A component that displays a set of reactions (emojis) for the user to select.
 * It appears as a horizontal row and uses framer-motion for animations.
 *
 * @param {ReactionSelectorProps} props - The component props.
 * @returns {React.ReactElement | null} The rendered component or null if not visible.
 *
 * @example
 * // Parent component usage:
 * const [showReactions, setShowReactions] = useState(false);
 * const handleSelectReaction = (reaction: ReactionType) => {
 *   console.log(`Selected reaction: ${reaction}`);
 *   // Call API to add reaction to a post/comment with id 'postId'
 *   // addReactionApi({ postId, reaction });
 *   setShowReactions(false); // Hide selector after selection
 * };
 *
 * return (
 *   <div style={{ position: 'relative' }}> // Parent needs positioning context
 *     <button onClick={() => setShowReactions(!showReactions)}>React</button>
 *     <ReactionSelector
 *       isVisible={showReactions}
 *       onSelect={handleSelectReaction}
 *     />
 *   </div>
 * );
 *
 * @remarks
 * - The parent container of this component should have `position: relative` or `position: absolute`
 *   to ensure the selector is positioned correctly relative to its intended trigger element.
 * - The `onSelect` handler provided by the parent is responsible for the actual reaction logic
 *   (e.g., API calls), making this component reusable across different features (posts, comments, etc.).
 */
const ReactionSelector: React.FC<ReactionSelectorProps> = ({
  onSelect,
  isVisible,
}) => {
  if (!isVisible) return null;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="hidden" // Apply exit animation
      className="absolute -top-12 left-0 mb-2 flex items-center space-x-1 bg-white dark:bg-gray-700 rounded-full p-1.5 shadow-lg border border-gray-200 dark:border-gray-600 z-10"
      onClick={(e) => e.stopPropagation()} // Prevent click from bubbling up
    >
      {reactions.map((reaction) => (
        <motion.button
          key={reaction.type}
          variants={itemVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={() => onSelect(reaction.type)}
          className="text-2xl p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none"
          title={reaction.label} // Tooltip for accessibility
        >
          {reaction.emoji}
        </motion.button>
      ))}
    </motion.div>
  );
};

export default ReactionSelector;
