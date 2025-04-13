"use client";

// Add the api import
import api from "../../utils/api";

console.log("--- UsersPosts Component Executing ---"); // Add basic check

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Post, UsersPostsProps, Comment } from "../../types/posts";
import MediaViewer from "./MediaViewer";
import PostCard from "./PostCard";

// Import custom hooks
import useComments from "../../hooks/useComments";
import useReactions from "../../hooks/useReactions";
import useMediaReactions from "../../hooks/useMediaReactions";
import useMediaViewer from "../../hooks/useMediaViewer";
import usePostVisibility from "../../hooks/usePostVisibility";

// Animation variants
import { containerVariants } from "../../types/posts";

// --- Component ---
const UsersPosts: React.FC<UsersPostsProps> = ({
  currentUserId,
  authToken,
  posts,
  onReactionUpdate,
}) => {
  // API base URL
  const apiBaseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "";
  console.log("API Base URL in UsersPosts:", apiBaseUrl);

  // Use our custom hooks
  const {
    postComments,
    commentInputs,
    commentLoading,
    handleCommentChange,
    handleCommentSubmit,
    initializePostComments,
  } = useComments({
    initialComments: {}, // Just pass empty object as initial state
    authToken: authToken as string | null | undefined,
    apiBaseUrl,
  });

  const {
    userReactions,
    optimisticReactionCounts,
    activeReactionSelector,
    likedPosts,
    handleLikeToggle,
    handleReactionSelect,
    showReactionSelector,
    hideReactionSelector,
  } = useReactions({
    posts,
    apiBaseUrl,
    authToken: authToken as string | null | undefined,
    onReactionUpdate,
  });

  // New hook for media reactions - simplified return value
  const {
    userMediaReactions,
    optimisticMediaReactionCounts,
    handleMediaReactionSelect,
  } = useMediaReactions({
    mediaItems: posts.flatMap((post) =>
      (post.mediaItems || []).map((media) => media)
    ),
    apiBaseUrl,
    authToken: authToken as string | null | undefined,
    // No need for onMediaReactionUpdate callback here unless needed elsewhere
  });

  const {
    viewerMedia,
    viewerMediaContext,
    isViewerOpen,
    openMediaViewer,
    closeMediaViewer,
  } = useMediaViewer({
    apiBaseUrl,
  });

  const { isPostContentVisible } = usePostVisibility({
    currentUserId,
  });

  // Initialize comments when posts change
  useEffect(() => {
    initializePostComments(posts);
  }, [posts, initializePostComments]);

  return (
    <>
      <motion.div
        className="space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {posts.map((post) => {
          const isVisible = isPostContentVisible(post);
          const isLiked = likedPosts.has(post.id);
          const currentReaction = userReactions[post.id] || null;

          // Use optimistic counts if available, otherwise fall back to prop counts
          const displayCounts =
            optimisticReactionCounts[post.id] ?? post.reactionCounts ?? {};

          return (
            <PostCard
              key={post.id}
              post={post}
              currentUserId={currentUserId}
              apiBaseUrl={apiBaseUrl}
              isLiked={isLiked}
              currentReaction={currentReaction}
              displayCounts={displayCounts}
              commentInput={commentInputs[post.id] || ""}
              commentsForPost={postComments[post.id] || []}
              isCommentLoading={commentLoading[post.id] || false}
              isVisible={isVisible}
              activeReactionSelector={activeReactionSelector}
              onShowReactionSelector={showReactionSelector}
              onHideReactionSelector={hideReactionSelector}
              onReactionSelect={handleReactionSelect}
              onCommentChange={handleCommentChange}
              onCommentSubmit={handleCommentSubmit}
              onOpenMediaViewer={openMediaViewer}
              // Pass only necessary media reaction props
              userMediaReactions={userMediaReactions}
              mediaReactionCounts={optimisticMediaReactionCounts}
              onMediaReactionSelect={handleMediaReactionSelect}
            />
          );
        })}
      </motion.div>

      {/* Fullscreen Media Viewer Modal */}
      <MediaViewer
        isOpen={isViewerOpen}
        initialMedia={viewerMedia}
        initialMediaContext={viewerMediaContext}
        onClose={closeMediaViewer}
        apiBaseUrl={apiBaseUrl}
      />
    </>
  );
};

export default UsersPosts;
