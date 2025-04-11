import React, { memo } from "react";
import UserAvatar from "../../app/components/UserAvatar";
import { Comment } from "../../types/posts";

interface CommentItemProps {
  comment: Comment;
  apiBaseUrl: string;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, apiBaseUrl }) => {
  return (
    <div className="flex items-start space-x-2 text-sm">
      <div className="flex-shrink-0 pt-1">
        <UserAvatar
          user={{
            id: comment.author.id,
            username: comment.author.username,
            avatarUrl:
              comment.author.avatar && apiBaseUrl
                ? `${apiBaseUrl}${comment.author.avatar}`
                : undefined,
          }}
          size="xs"
        />
      </div>
      <div className="flex-1 bg-gray-50 dark:bg-gray-700/50 p-2.5 rounded-lg">
        <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 mb-0.5">
          {comment.author.username}
        </p>
        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">
          {comment.content}
        </p>
        {/* Optional: Add timestamp for comment */}
        {/* <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{new Date(comment.createdAt).toLocaleTimeString()}</p> */}
      </div>
    </div>
  );
};

// Simple comparison function for CommentItem
const areEqual = (prevProps: CommentItemProps, nextProps: CommentItemProps) => {
  // Comments are immutable once created, so we can just compare IDs
  if (prevProps.comment.id !== nextProps.comment.id) {
    return false;
  }

  // For safety, check content as well (in case the comment was edited)
  if (prevProps.comment.content !== nextProps.comment.content) {
    return false;
  }

  // Check if apiBaseUrl changed (affects avatar URL)
  if (prevProps.apiBaseUrl !== nextProps.apiBaseUrl) {
    return false;
  }

  // If we get here, consider props equal
  return true;
};

export default memo(CommentItem, areEqual);
