import React, { useEffect, useState, memo, useMemo } from "react";
import { motion } from "framer-motion";
import { Masonry } from "react-plock";
import { ClientPostMediaItem } from "../../types/posts"; // Import the new type
import MediaThumbnail from "./MediaThumbnail";
import { ReactionType } from "../Reactions";

export interface PostMediaGalleryProps {
  mediaItems: ClientPostMediaItem[]; // Rename prop and use new type
  apiBaseUrl: string;
  postId: string;
  onMediaClick: (
    media: ClientPostMediaItem, // Update type here
    apiBaseUrl: string,
    postId?: string,
    mediaIndex?: number,
    allMedia?: ClientPostMediaItem[] // Update type here
  ) => void;
  userMediaReactions?: Record<string, ReactionType | null>;
  mediaReactionCounts?: Record<string, Record<ReactionType, number>>;
  onMediaReactionSelect?: (
    mediaId: string,
    reaction: ReactionType | null
  ) => void;
}

const PostMediaGallery: React.FC<PostMediaGalleryProps> = ({
  mediaItems, // Use the new prop name
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
  if (!mediaItems || mediaItems.length === 0) {
    return null;
  }

  // Memoize the max visible items calculation
  const maxVisibleItems = useMemo(
    () => (windowWidth < 768 ? 6 : 9),
    [windowWidth]
  );

  // Helper to get media reaction data
  const getMediaReactionData = (media: ClientPostMediaItem) => {
    const mediaId = media.id; // Use the actual ID from the media item
    const currentMediaReaction = userMediaReactions[mediaId] || null;
    // Use reaction counts passed via props (keyed by mediaId)
    const currentReactionCounts = mediaReactionCounts[mediaId] ?? {};
    return {
      mediaId,
      currentMediaReaction,
      currentReactionCounts,
    };
  };

  // Single media case
  if (mediaItems.length === 1) {
    const { mediaId, currentMediaReaction, currentReactionCounts } =
      getMediaReactionData(mediaItems[0]);

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-4 flex justify-center"
      >
        <MediaThumbnail
          media={mediaItems[0]} // Use mediaItems
          apiBaseUrl={apiBaseUrl}
          index={0}
          onClick={onMediaClick}
          postId={postId}
          allMedia={mediaItems} // Use mediaItems
          layout="single"
          currentMediaReaction={currentMediaReaction}
          mediaReactionCounts={currentReactionCounts}
          onMediaReactionSelect={onMediaReactionSelect}
        />
      </motion.div>
    );
  }

  // 2-4 items grid case
  if (mediaItems.length <= 4) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-4"
      >
        <div
          className={
            mediaItems.length === 2
              ? "grid grid-cols-2 gap-3"
              : mediaItems.length === 3
              ? "grid grid-cols-1fr-1fr gap-3"
              : "grid grid-cols-2 gap-3"
          }
        >
          {mediaItems.map((media, index) => {
            // Use mediaItems
            const { mediaId, currentMediaReaction, currentReactionCounts } =
              getMediaReactionData(media);
            return (
              <MediaThumbnail
                key={index}
                media={media}
                apiBaseUrl={apiBaseUrl}
                index={index}
                onClick={onMediaClick}
                postId={postId}
                allMedia={mediaItems} // Use mediaItems
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
  const visibleItems = mediaItems.slice(0, maxVisibleItems); // Use mediaItems
  const hasHiddenItems = mediaItems.length > maxVisibleItems; // Use mediaItems

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
          const hiddenCount = mediaItems.length - maxVisibleItems; // Use mediaItems

          const { mediaId, currentMediaReaction, currentReactionCounts } =
            getMediaReactionData(media);

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
              allMedia={mediaItems} // Use mediaItems
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
  if (prevProps.mediaItems.length !== nextProps.mediaItems.length) return false;

  // Check if any media items changed (including their reaction counts)
  for (let i = 0; i < prevProps.mediaItems.length; i++) {
    const prevMedia = prevProps.mediaItems[i];
    const nextMedia = nextProps.mediaItems[i];

    if (
      prevMedia.id !== nextMedia.id || // Compare by ID
      prevMedia.url !== nextMedia.url ||
      prevMedia.type !== nextMedia.type ||
      prevMedia.source !== nextMedia.source
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
