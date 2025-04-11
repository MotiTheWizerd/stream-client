import React, { useEffect, useState, memo, useMemo } from "react";
import { motion } from "framer-motion";
import { Masonry } from "react-plock";
import { MediaItem } from "../../types/posts";
import MediaThumbnail from "./MediaThumbnail";
import { ReactionType } from "../ReactionSelector";

export interface PostMediaGalleryProps {
  mediaUrls: MediaItem[];
  apiBaseUrl: string;
  postId: string;
  onMediaClick: (
    media: MediaItem,
    apiBaseUrl: string,
    postId?: string,
    mediaIndex?: number,
    allMedia?: MediaItem[]
  ) => void;
  userMediaReactions?: Record<string, ReactionType | null>;
  mediaReactionCounts?: Record<string, Record<ReactionType, number>>;
  onMediaReactionSelect?: (
    mediaId: string,
    reaction: ReactionType | null
  ) => void;
}

const PostMediaGallery: React.FC<PostMediaGalleryProps> = ({
  mediaUrls,
  apiBaseUrl,
  postId,
  onMediaClick,
  userMediaReactions = {},
  mediaReactionCounts = {},
  onMediaReactionSelect = () => {},
}) => {
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  // Listen for window resizes to handle responsive layout changes
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // No media to display
  if (!mediaUrls || mediaUrls.length === 0) {
    return null;
  }

  // Memoize the max visible items calculation
  const maxVisibleItems = useMemo(
    () => (windowWidth < 768 ? 6 : 9),
    [windowWidth]
  );

  // Helper to get media reaction data
  const getMediaReactionData = (media: MediaItem, index: number) => {
    const mediaId = media.mediaId || `${postId}_media_${index}`;
    const currentMediaReaction = userMediaReactions[mediaId] || null;
    // Use optimistic counts if available, otherwise use the counts from props
    const currentReactionCounts =
      mediaReactionCounts[mediaId] ?? media.mediaReactionCounts ?? {};

    return {
      mediaId,
      currentMediaReaction,
      currentReactionCounts,
    };
  };

  // Single media case
  if (mediaUrls.length === 1) {
    const { mediaId, currentMediaReaction, currentReactionCounts } =
      getMediaReactionData(mediaUrls[0], 0);

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-4 flex justify-center"
      >
        <MediaThumbnail
          media={mediaUrls[0]}
          apiBaseUrl={apiBaseUrl}
          index={0}
          onClick={onMediaClick}
          postId={postId}
          allMedia={mediaUrls}
          layout="single"
          currentMediaReaction={currentMediaReaction}
          mediaReactionCounts={currentReactionCounts}
          onMediaReactionSelect={onMediaReactionSelect}
        />
      </motion.div>
    );
  }

  // 2-4 items grid case
  if (mediaUrls.length <= 4) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-4"
      >
        <div
          className={
            mediaUrls.length === 2
              ? "grid grid-cols-2 gap-3"
              : mediaUrls.length === 3
              ? "grid grid-cols-1fr-1fr gap-3"
              : "grid grid-cols-2 gap-3"
          }
        >
          {mediaUrls.map((media, index) => {
            const { mediaId, currentMediaReaction, currentReactionCounts } =
              getMediaReactionData(media, index);
            return (
              <MediaThumbnail
                key={index}
                media={media}
                apiBaseUrl={apiBaseUrl}
                index={index}
                onClick={onMediaClick}
                postId={postId}
                allMedia={mediaUrls}
                layout="grid"
                currentMediaReaction={currentMediaReaction}
                mediaReactionCounts={currentReactionCounts}
                onMediaReactionSelect={onMediaReactionSelect}
              />
            );
          })}
        </div>
      </motion.div>
    );
  }

  // 5+ items masonry case
  // Determine max visible items based on screen size
  const visibleItems = mediaUrls.slice(0, maxVisibleItems);
  const hasHiddenItems = mediaUrls.length > maxVisibleItems;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="mb-4"
    >
      <Masonry
        items={visibleItems}
        config={{
          columns: [2, 3, 4], // Mobile, tablet, desktop
          gap: [8, 12, 16], // Different gaps for different breakpoints
          media: [640, 768, 1024], // Breakpoints
          useBalancedLayout: true, // Balance column heights
        }}
        render={(media, index) => {
          // Handle last visible item with "more" overlay
          const isLastVisible =
            hasHiddenItems && index === visibleItems.length - 1;
          const hiddenCount = mediaUrls.length - maxVisibleItems;

          const { mediaId, currentMediaReaction, currentReactionCounts } =
            getMediaReactionData(media, index);

          return (
            <MediaThumbnail
              key={index}
              media={media}
              apiBaseUrl={apiBaseUrl}
              index={index}
              showMoreOverlay={isLastVisible}
              totalHidden={hiddenCount}
              onClick={onMediaClick}
              postId={postId}
              allMedia={mediaUrls}
              layout="masonry"
              currentMediaReaction={currentMediaReaction}
              mediaReactionCounts={currentReactionCounts}
              onMediaReactionSelect={onMediaReactionSelect}
            />
          );
        }}
      />
    </motion.div>
  );
};

// Custom comparison function
const areEqual = (
  prevProps: PostMediaGalleryProps,
  nextProps: PostMediaGalleryProps
) => {
  // Check if postId changed
  if (prevProps.postId !== nextProps.postId) return false;

  // Check if apiBaseUrl changed
  if (prevProps.apiBaseUrl !== nextProps.apiBaseUrl) return false;

  // Check if media array lengths have changed
  if (prevProps.mediaUrls.length !== nextProps.mediaUrls.length) return false;

  // Check if any media items changed (including their reaction counts)
  for (let i = 0; i < prevProps.mediaUrls.length; i++) {
    const prevMedia = prevProps.mediaUrls[i];
    const nextMedia = nextProps.mediaUrls[i];

    if (
      prevMedia.media !== nextMedia.media ||
      prevMedia.type !== nextMedia.type ||
      prevMedia.source !== nextMedia.source ||
      // Also compare the reaction counts on the media item itself if available
      JSON.stringify(prevMedia.mediaReactionCounts || {}) !==
        JSON.stringify(nextMedia.mediaReactionCounts || {})
    ) {
      return false;
    }
  }

  // Check if user reactions map changed (passed from hook)
  const prevUserReactionKeys = Object.keys(prevProps.userMediaReactions || {});
  const nextUserReactionKeys = Object.keys(nextProps.userMediaReactions || {});

  if (prevUserReactionKeys.length !== nextUserReactionKeys.length) return false;

  for (const key of prevUserReactionKeys) {
    if (
      prevProps.userMediaReactions?.[key] !==
      nextProps.userMediaReactions?.[key]
    ) {
      return false;
    }
  }

  // Check if optimistic reaction counts map changed (passed from hook)
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

export default memo(PostMediaGallery, areEqual);
