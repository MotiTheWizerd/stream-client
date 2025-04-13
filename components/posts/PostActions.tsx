import React, { memo } from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { ReactionDisplay, ReactionType } from "../Reactions";

interface PostActionsProps {
  postId: string;
  allowComments: boolean;
  commentCount: number;
  currentReaction: ReactionType | null;
  displayCounts: Record<ReactionType, number>;
  canInteract: boolean;
  onReactionSelect: (postId: string, reaction: ReactionType | null) => void;
  onCommentClick: (postId: string) => void;
}

const PostActions: React.FC<PostActionsProps> = ({
  postId,
  allowComments,
  commentCount,
  currentReaction,
  displayCounts,
  canInteract,
  onReactionSelect,
  onCommentClick,
}) => {
  // If the post doesn't allow interactions, don't render anything
  if (!canInteract) return null;

  return (
    <motion.div
      className="flex items-center justify-between pt-3 mt-3 border-t border-gray-100 dark:border-gray-700"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
    >
      <div className="flex items-center justify-between w-full">
        {/* Container for Reaction Display and Buttons */}
        <div className="flex items-center space-x-5 w-full">
          {/* Reaction Display - Using our new component */}
          <ReactionDisplay
            targetId={postId}
            targetType="Post"
            currentReaction={currentReaction}
            reactionCounts={displayCounts}
            onReactionSelect={onReactionSelect}
            className="flex-grow"
            compact={false}
          />

          {/* Comment Button */}
          {allowComments && (
            <motion.button
              className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors ml-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onCommentClick(postId)}
            >
              <MessageCircle size={18} />
              <span className="ml-1">{commentCount}</span>
            </motion.button>
          )}
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
