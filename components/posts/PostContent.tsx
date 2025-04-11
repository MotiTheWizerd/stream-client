import React, { memo } from "react";
import { motion } from "framer-motion";
import PrivatePostPlaceholder from "../PrivatePostPlaceholder";

export interface PostContentProps {
  content: string;
  hasMedia: boolean;
  isVisible: boolean;
  authorUsername: string;
}

const PostContent: React.FC<PostContentProps> = ({
  content,
  hasMedia,
  isVisible,
  authorUsername,
}) => {
  if (!isVisible) {
    return <PrivatePostPlaceholder authorUsername={authorUsername} />;
  }

  if (!content) {
    return null;
  }

  return (
    <motion.div
      className={`mb-4 ${hasMedia ? "" : "text-post-container"}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <p
        className={`text-gray-800 dark:text-gray-300 whitespace-pre-wrap break-words leading-relaxed ${
          !hasMedia
            ? "text-lg p-3 bg-gray-50 dark:bg-gray-800/60 rounded-lg border-l-4 border-purple-500 dark:border-purple-700"
            : "text-base"
        }`}
      >
        {content}
      </p>

      {/* Add visual flourish for text-only posts */}
      {!hasMedia && content.length > 100 && (
        <div className="h-1 w-24 mt-4 mx-auto bg-gradient-to-r from-transparent via-purple-400/20 to-transparent rounded"></div>
      )}
    </motion.div>
  );
};

// Custom comparison function
const areEqual = (prevProps: PostContentProps, nextProps: PostContentProps) => {
  return (
    prevProps.content === nextProps.content &&
    prevProps.hasMedia === nextProps.hasMedia &&
    prevProps.isVisible === nextProps.isVisible &&
    prevProps.authorUsername === nextProps.authorUsername
  );
};

export default memo(PostContent, areEqual);
