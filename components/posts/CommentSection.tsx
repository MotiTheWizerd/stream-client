import React, { memo } from "react";
import { motion } from "framer-motion";
import { Comment } from "../../types/posts";
import CommentItem from "./CommentItem";

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  allowComments: boolean;
  currentUserId: string | null;
  apiBaseUrl: string;
  commentInput: string;
  isCommentLoading: boolean;
  onCommentChange: (postId: string, value: string) => void;
  onCommentSubmit: (postId: string) => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  postId,
  comments,
  allowComments,
  currentUserId,
  apiBaseUrl,
  commentInput,
  isCommentLoading,
  onCommentChange,
  onCommentSubmit,
}) => {
  return (
    <motion.div
      className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      {/* Display Existing Comments */}
      {comments && comments.length > 0 && (
        <div className="mb-4 space-y-3">
          <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
            Comments ({comments.length})
          </h4>
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              apiBaseUrl={apiBaseUrl}
            />
          ))}
        </div>
      )}

      {/* Comment Input */}
      {allowComments && currentUserId ? (
        <div className="flex items-center space-x-2">
          <input
            id={`comment-input-${postId}`}
            type="text"
            placeholder="Write a comment..."
            value={commentInput}
            onChange={(e) => onCommentChange(postId, e.target.value)}
            className="flex-grow px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
            disabled={isCommentLoading}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onCommentSubmit(postId);
              }
            }}
          />
          <motion.button
            onClick={() => onCommentSubmit(postId)}
            className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-full transition-colors ${
              !commentInput?.trim() || isCommentLoading
                ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
            disabled={!commentInput?.trim() || isCommentLoading}
            whileTap={{ scale: 0.95 }}
          >
            {isCommentLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
            ) : (
              "Post"
            )}
          </motion.button>
        </div>
      ) : allowComments ? (
        <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
          Log in to comment.
        </p>
      ) : null}
    </motion.div>
  );
};

const areEqual = (
  prevProps: CommentSectionProps,
  nextProps: CommentSectionProps
) => {
  if (prevProps.postId !== nextProps.postId) return false;

  if (prevProps.comments.length !== nextProps.comments.length) return false;

  if (prevProps.comments.length > 0 && nextProps.comments.length > 0) {
    if (
      prevProps.comments[prevProps.comments.length - 1].id !==
      nextProps.comments[nextProps.comments.length - 1].id
    ) {
      return false;
    }
  }

  if (prevProps.commentInput !== nextProps.commentInput) return false;

  if (prevProps.isCommentLoading !== nextProps.isCommentLoading) return false;

  if (
    prevProps.allowComments !== nextProps.allowComments ||
    prevProps.currentUserId !== nextProps.currentUserId ||
    prevProps.apiBaseUrl !== nextProps.apiBaseUrl
  ) {
    return false;
  }

  return true;
};

export default memo(CommentSection, areEqual);
