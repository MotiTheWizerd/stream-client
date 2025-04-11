import React, { memo } from "react";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import UserAvatar, { User } from "../../app/components/UserAvatar";
import { Author } from "../../types/posts";

export interface PostHeaderProps {
  author: Author;
  createdAt: string;
  visibility: "PUBLIC" | "SUBSCRIBERS";
  apiBaseUrl: string;
}

const PostHeader: React.FC<PostHeaderProps> = ({
  author,
  createdAt,
  visibility,
  apiBaseUrl,
}) => {
  const userForAvatar: User = {
    id: author.id,
    username: author.username,
    avatarUrl:
      author.avatar && apiBaseUrl ? `${apiBaseUrl}${author.avatar}` : undefined,
    isOnline: undefined,
  };

  const postDate = new Date(createdAt);

  // Format date as "Today", "Yesterday", or MM/DD/YYYY
  const formatDate = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (postDate.toDateString() === today.toDateString()) {
      return `Today at ${postDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else if (postDate.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${postDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else {
      return postDate.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year:
          postDate.getFullYear() !== today.getFullYear()
            ? "numeric"
            : undefined,
      });
    }
  };

  return (
    <div className="flex items-center mb-4">
      <div className="relative">
        <UserAvatar
          user={userForAvatar}
          size="sm"
          showUsername={true}
          textPosition="right"
          textColor="dark:text-white text-gray-900"
          textWeight="semibold"
        />
      </div>

      {/* Date & Visibility */}
      <div className="ml-auto flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
        {visibility === "SUBSCRIBERS" && (
          <motion.span
            title="Subscribers Only"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <Lock size={14} className="text-purple-500" />
          </motion.span>
        )}
        <p>{formatDate()}</p>
      </div>
    </div>
  );
};

// Create an equality function for memoization
const areEqual = (prevProps: PostHeaderProps, nextProps: PostHeaderProps) => {
  // Only re-render if any of these props change
  return (
    prevProps.author.id === nextProps.author.id &&
    prevProps.author.username === nextProps.author.username &&
    prevProps.author.avatar === nextProps.author.avatar &&
    prevProps.createdAt === nextProps.createdAt &&
    prevProps.visibility === nextProps.visibility &&
    prevProps.apiBaseUrl === nextProps.apiBaseUrl
  );
};

export default memo(PostHeader, areEqual);
