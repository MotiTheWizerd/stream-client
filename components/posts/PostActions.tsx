import React, { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Heart, ThumbsUp } from "lucide-react";
import ReactionSelector, {
  ReactionType,
  reactions as reactionMap,
} from "../ReactionSelector";

interface PostActionsProps {
  postId: string;
  allowComments: boolean;
  commentCount: number;
  currentReaction: ReactionType | null;
  displayCounts: Record<ReactionType, number>;
  activeReactionSelector: string | null;
  canInteract: boolean;
  onReactionSelect: (postId: string, reaction: ReactionType | null) => void;
  onShowReactionSelector: (postId: string) => void;
  onHideReactionSelector: () => void;
  onCommentClick: (postId: string) => void;
}

const PostActions: React.FC<PostActionsProps> = ({
  postId,
  allowComments,
  commentCount,
  currentReaction,
  displayCounts,
  activeReactionSelector,
  canInteract,
  onReactionSelect,
  onShowReactionSelector,
  onHideReactionSelector,
  onCommentClick,
}) => {
  // If the post doesn't allow interactions, don't render anything
  if (!canInteract) return null;

  // Calculate total reactions
  const totalReactions = Object.values(displayCounts).reduce(
    (sum: number, count: number) => sum + count,
    0
  );

  return (
    <motion.div
      className="flex items-center justify-between pt-3 mt-3 border-t border-gray-100 dark:border-gray-700"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
    >
      <div className="flex items-center justify-between w-full">
        {/* Container for Reaction Summary and Buttons */}
        <div className="flex items-center space-x-5">
          {/* Reaction Summary Area - Show icons and counts */}
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            {Object.entries(displayCounts)
              .filter(([, count]) => count > 0)
              .sort(([typeA], [typeB]) => {
                // Optional: Sort reactions, e.g., by count descending
                // return (displayCounts[typeB as ReactionType] || 0) - (displayCounts[typeA as ReactionType] || 0);
                return 0; // Default: keep original order for now
              })
              .map(([type, count]) => {
                const reactionInfo = reactionMap.find((r) => r.type === type);
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
                        postId,
                        currentReaction === type ? null : reactionInfo.type
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
            className="relative flex items-center space-x-4 ml-auto" // Use ml-auto to push buttons right
            onMouseEnter={() => onShowReactionSelector(postId)}
            onMouseLeave={() => onHideReactionSelector()}
          >
            {/* Reaction Selector Popup */}
            <AnimatePresence>
              {activeReactionSelector === postId && (
                <ReactionSelector
                  isVisible={activeReactionSelector === postId}
                  onSelect={(reaction) => onReactionSelect(postId, reaction)}
                />
              )}
            </AnimatePresence>

            {/* Basic 'React' Button (Opens Selector) */}
            <motion.button
              className={`flex items-center space-x-1 text-sm ${
                currentReaction // Check if user reacted (any reaction)
                  ? "text-blue-600 dark:text-blue-500 font-semibold"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              } transition-colors`}
              onClick={() =>
                onReactionSelect(postId, currentReaction ? null : "LIKE")
              } // Toggle LIKE by default
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={currentReaction ? "Change Reaction" : "Add Reaction"}
            >
              {currentReaction ? (
                <ThumbsUp size={18} className="fill-current" />
              ) : (
                <Heart size={18} className="fill-current" />
              )}
              {/* Keep text simple or remove if icons are clear enough */}
              {/* <span>{currentReaction ? 'Reacted' : 'React'}</span> */}
            </motion.button>

            {/* Comment Button */}
            {allowComments && (
              <motion.button
                className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onCommentClick(postId)}
              >
                <MessageCircle size={18} />
                <span className="ml-1">{commentCount}</span>
              </motion.button>
            )}

            {/* Share Button (Optional) */}
            {/* <motion.button
              className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Share2 size={18} />
              <span>Share</span>
            </motion.button> */}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

// Custom comparison function for PostActions
const areEqual = (prevProps: PostActionsProps, nextProps: PostActionsProps) => {
  // Always check the postId as a basic check
  if (prevProps.postId !== nextProps.postId) return false;

  // Check if reaction state changed
  if (prevProps.currentReaction !== nextProps.currentReaction) return false;

  // Check comment count changed (important for UI)
  if (prevProps.commentCount !== nextProps.commentCount) return false;

  // Check if reaction counts changed
  const prevReactionKeys = Object.keys(prevProps.displayCounts);
  const nextReactionKeys = Object.keys(nextProps.displayCounts);

  if (prevReactionKeys.length !== nextReactionKeys.length) return false;

  for (const key of prevReactionKeys) {
    if (
      prevProps.displayCounts[key as ReactionType] !==
      nextProps.displayCounts[key as ReactionType]
    ) {
      return false;
    }
  }

  // Check if reaction selector state changed for this post
  if (
    (prevProps.activeReactionSelector === prevProps.postId) !==
    (nextProps.activeReactionSelector === nextProps.postId)
  ) {
    return false;
  }

  // Additional basic props check
  if (
    prevProps.allowComments !== nextProps.allowComments ||
    prevProps.canInteract !== nextProps.canInteract
  ) {
    return false;
  }

  // Functions don't need to be checked as they should be memoized in the parent

  return true;
};

export default memo(PostActions, areEqual);
