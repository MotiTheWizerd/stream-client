import React, { memo } from "react";
import { motion } from "framer-motion";
import { Post, postVariants, Comment } from "../../types/posts";
import { ReactionType } from "../ReactionSelector";
import PostHeader from "./PostHeader";
import PostContent from "./PostContent";
import PostMediaGallery from "./PostMediaGallery";
import PostActions from "./PostActions";
import CommentSection from "./CommentSection";

export interface PostCardProps {
  post: Post;
  currentUserId: string | null;
  apiBaseUrl: string;
  isLiked: boolean;
  currentReaction: ReactionType | null;
  displayCounts: Record<ReactionType, number>;
  commentInput: string;
  commentsForPost: Comment[];
  isCommentLoading: boolean;
  isVisible: boolean;
  activeReactionSelector: string | null;
  onShowReactionSelector: (postId: string) => void;
  onHideReactionSelector: () => void;
  onReactionSelect: (postId: string, reaction: ReactionType | null) => void;
  onCommentChange: (postId: string, value: string) => void;
  onCommentSubmit: (postId: string) => void;
  onOpenMediaViewer: (
    media: any,
    apiBaseUrl: string,
    postId?: string,
    mediaIndex?: number,
    allMedia?: any[]
  ) => void;
  userMediaReactions?: Record<string, ReactionType | null>;
  mediaReactionCounts?: Record<string, Record<ReactionType, number>>;
  onMediaReactionSelect?: (
    mediaId: string,
    reaction: ReactionType | null
  ) => void;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  currentUserId,
  apiBaseUrl,
  isLiked,
  currentReaction,
  displayCounts,
  commentInput,
  commentsForPost,
  isCommentLoading,
  isVisible,
  activeReactionSelector,
  onShowReactionSelector,
  onHideReactionSelector,
  onReactionSelect,
  onCommentChange,
  onCommentSubmit,
  onOpenMediaViewer,
  userMediaReactions = {},
  mediaReactionCounts = {},
  onMediaReactionSelect = () => {},
}) => {
  // Helper function to focus on comment input
  const handleCommentClick = (postId: string) => {
    // Find the comment input ref and focus it
    const inputElement = document.getElementById(`comment-input-${postId}`);
    inputElement?.focus();
  };

  return (
    <motion.div
      key={post.id}
      variants={postVariants}
      whileHover="hover"
      className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm max-w-[1400px] mx-auto"
    >
      {/* Post Header with Author info, date, and visibility */}
      <PostHeader
        author={post.author}
        createdAt={post.createdAt}
        visibility={post.visibility}
        apiBaseUrl={apiBaseUrl}
      />

      {/* Post Content (text) */}
      <PostContent
        content={post.content}
        hasMedia={post.mediaUrls?.length > 0}
        isVisible={isVisible}
        authorUsername={post.author.username}
      />

      {/* Post Media Gallery */}
      {isVisible && post.mediaUrls && post.mediaUrls.length > 0 && (
        <PostMediaGallery
          mediaUrls={post.mediaUrls}
          apiBaseUrl={apiBaseUrl}
          postId={post.id}
          onMediaClick={onOpenMediaViewer}
          userMediaReactions={userMediaReactions}
          mediaReactionCounts={mediaReactionCounts}
          onMediaReactionSelect={onMediaReactionSelect}
        />
      )}

      {/* Post Actions - Reactions and interaction buttons */}
      {isVisible && post.canInteract && (
        <PostActions
          postId={post.id}
          allowComments={post.allowComments}
          commentCount={post.commentCount}
          currentReaction={currentReaction}
          displayCounts={displayCounts}
          activeReactionSelector={activeReactionSelector}
          canInteract={post.canInteract}
          onReactionSelect={onReactionSelect}
          onShowReactionSelector={onShowReactionSelector}
          onHideReactionSelector={onHideReactionSelector}
          onCommentClick={handleCommentClick}
        />
      )}

      {/* Comment Section - Only show if post is visible */}
      {isVisible && (
        <CommentSection
          postId={post.id}
          comments={commentsForPost}
          allowComments={post.allowComments}
          currentUserId={currentUserId}
          apiBaseUrl={apiBaseUrl}
          commentInput={commentInput}
          isCommentLoading={isCommentLoading}
          onCommentChange={onCommentChange}
          onCommentSubmit={onCommentSubmit}
        />
      )}
    </motion.div>
  );
};

// Custom prop comparison function
const areEqual = (prevProps: PostCardProps, nextProps: PostCardProps) => {
  // Check post ID, visibility, post reactions
  if (
    prevProps.post.id !== nextProps.post.id ||
    prevProps.isVisible !== nextProps.isVisible ||
    prevProps.currentReaction !== nextProps.currentReaction ||
    prevProps.activeReactionSelector !== nextProps.activeReactionSelector
  ) {
    return false;
  }

  // Check post reaction counts
  const prevCountsKeys = Object.keys(prevProps.displayCounts);
  const nextCountsKeys = Object.keys(nextProps.displayCounts);

  if (prevCountsKeys.length !== nextCountsKeys.length) return false;

  for (const key of prevCountsKeys) {
    if (
      prevProps.displayCounts[key as ReactionType] !==
      nextProps.displayCounts[key as ReactionType]
    ) {
      return false;
    }
  }

  // Check comments
  if (prevProps.commentsForPost.length !== nextProps.commentsForPost.length)
    return false;
  if (prevProps.commentInput !== nextProps.commentInput) return false;
  if (prevProps.isCommentLoading !== nextProps.isCommentLoading) return false;

  // Check media user reactions
  const prevMediaReactionsKeys = Object.keys(
    prevProps.userMediaReactions || {}
  );
  const nextMediaReactionsKeys = Object.keys(
    nextProps.userMediaReactions || {}
  );

  if (prevMediaReactionsKeys.length !== nextMediaReactionsKeys.length)
    return false;

  for (const key of prevMediaReactionsKeys) {
    if (
      prevProps.userMediaReactions?.[key] !==
      nextProps.userMediaReactions?.[key]
    ) {
      return false;
    }
  }

  // Check media optimistic reaction counts
  const prevOptimisticKeys = Object.keys(prevProps.mediaReactionCounts || {});
  const nextOptimisticKeys = Object.keys(nextProps.mediaReactionCounts || {});

  if (prevOptimisticKeys.length !== nextOptimisticKeys.length) return false;

  for (const key of prevOptimisticKeys) {
    const prevCounts = prevProps.mediaReactionCounts?.[key] || {};
    const nextCounts = nextProps.mediaReactionCounts?.[key] || {};
    if (JSON.stringify(prevCounts) !== JSON.stringify(nextCounts)) {
      return false;
    }
  }

  // If we get here, props are considered equal
  return true;
};

// Export the memoized component
export default memo(PostCard, areEqual);
