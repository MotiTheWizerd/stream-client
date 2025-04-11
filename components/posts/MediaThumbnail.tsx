import React, { memo, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Link, FileQuestion, Maximize, Heart } from "lucide-react";
import { MediaItem } from "../../types/posts";
import ReactionSelector, {
  ReactionType,
  reactions as reactionMap,
} from "../ReactionSelector";

export interface MediaThumbnailProps {
  media: MediaItem;
  apiBaseUrl: string;
  index: number;
  showMoreOverlay?: boolean;
  totalHidden?: number;
  onClick: (
    media: MediaItem,
    apiBaseUrl: string,
    postId?: string,
    mediaIndex?: number,
    allMedia?: MediaItem[]
  ) => void;
  postId?: string;
  allMedia?: MediaItem[];
  layout?: "masonry" | "grid" | "single";
  currentMediaReaction?: ReactionType | null;
  mediaReactionCounts?: Record<ReactionType, number>;
  onMediaReactionSelect?: (
    mediaId: string,
    reaction: ReactionType | null
  ) => void;
}

const MediaThumbnail: React.FC<MediaThumbnailProps> = ({
  media,
  apiBaseUrl,
  index,
  showMoreOverlay = false,
  totalHidden = 0,
  onClick,
  postId,
  allMedia,
  layout = "grid",
  currentMediaReaction = null,
  mediaReactionCounts = {},
  onMediaReactionSelect = () => {},
}) => {
  const thumbnailUrl =
    media.source === "link" ? media.media : `${apiBaseUrl}${media.media}`;

  const mediaId = media.mediaId || `${postId}_media_${index}`;

  // --- LOCAL STATE for selector visibility ---
  const [isSelectorVisible, setIsSelectorVisible] = useState(false);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate total reactions for this media
  const totalMediaReactions = Object.values(mediaReactionCounts).reduce(
    (sum, count) => sum + count,
    0
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  // Handle external links
  if (
    media.source === "link" &&
    media.type !== "image" &&
    media.type !== "video"
  ) {
    return (
      <a
        href={thumbnailUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center space-x-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition duration-150 ease-in-out mr-2 mb-2 text-sm"
      >
        <Link size={18} className="text-blue-500 flex-shrink-0" />
        <span className="text-blue-600 dark:text-blue-400 truncate hover:underline">
          {media.title || "View Link"}
        </span>
      </a>
    );
  }

  // Error case
  if (!thumbnailUrl && media.source !== "link") {
    return <div className="text-red-500">Media Error</div>;
  }

  // Get appropriate size classes based on layout
  const getSizeClasses = () => {
    if (layout === "single") {
      return "w-full max-w-xl mx-auto";
    } else if (layout === "grid") {
      // For grid layout, handle special cases like 3-item layouts
      if (allMedia?.length === 3) {
        return index === 0 ? "first-image" : "";
      }
      return "w-full";
    }
    // For masonry, we rely on the parent to handle sizing
    return "";
  };

  // Determine classes based on layout and media type
  const containerClasses = `relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 ${
    !showMoreOverlay
      ? "hover:border-blue-500 dark:hover:border-blue-400 group shadow-sm"
      : ""
  } transition duration-150 ease-in-out ${
    media.type === "video" ? "bg-black" : "bg-gray-100 dark:bg-gray-800"
  } ${getSizeClasses()}`;

  // Handle show more overlay case
  if (showMoreOverlay) {
    return (
      <div className={containerClasses}>
        {media.type === "image" ? (
          <img
            src={thumbnailUrl}
            alt={media.title || `Media ${index + 1}`}
            className="w-full h-auto object-cover block"
            loading="lazy"
          />
        ) : media.type === "video" ? (
          <video
            src={thumbnailUrl}
            className="w-full h-full object-cover"
            muted
            preload="metadata"
            playsInline
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center p-4">
            <FileQuestion size={40} className="text-gray-500" />
          </div>
        )}

        {/* More overlay */}
        <div
          className="absolute inset-0 bg-black/70 flex items-center justify-center z-5 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onClick(media, apiBaseUrl, postId, index, allMedia);
          }}
        >
          <div className="text-white text-2xl font-bold">+{totalHidden}</div>
        </div>
      </div>
    );
  }

  // Standard media display
  return (
    <motion.div
      ref={containerRef}
      data-media-id={mediaId}
      className={containerClasses}
      style={layout === "single" ? { aspectRatio: "auto" } : {}}
      whileHover={layout === "single" ? { scale: 1.01 } : { scale: 1.02 }}
    >
      {media.type === "image" ? (
        layout === "single" ? (
          <Image
            src={thumbnailUrl}
            alt={media.title || `Media ${index + 1}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            className="object-cover"
            onError={(e) => {
              console.warn(`Error loading image: ${thumbnailUrl}`);
              e.currentTarget.style.display = "none";
            }}
            onLoad={(e) => {
              if (layout === "single") {
                const img = e.currentTarget as HTMLImageElement;
                if (img.naturalWidth && img.naturalHeight) {
                  const container = img.parentElement?.parentElement;
                  if (container) {
                    // Calculate ratio to determine image type
                    const ratio = img.naturalWidth / img.naturalHeight;

                    // Keep aspect ratio proportional to actual image
                    container.style.aspectRatio = ratio.toString();

                    // For single images, adjust container to match natural proportions
                    const parent = container.parentElement;
                    if (parent) {
                      // For single images, limit max height based on aspect ratio
                      if (ratio < 0.75) {
                        // Very tall images
                        container.style.maxHeight = "70vh";
                        container.style.maxWidth = "min(600px, 100%)";
                      } else if (ratio > 1.5) {
                        // Very wide images
                        container.style.maxHeight = "min(600px, 50vh)";
                        container.style.width = "min(1000px, 100%)";
                      } else {
                        // Square-ish images
                        container.style.maxHeight = "min(700px, 60vh)";
                        container.style.maxWidth = "min(800px, 100%)";
                      }
                    }
                  }
                }
              }
            }}
          />
        ) : (
          <img
            src={thumbnailUrl}
            alt={media.title || `Media ${index + 1}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.warn(`Error loading grid image: ${thumbnailUrl}`);
              (e.target as HTMLImageElement).style.display = "none";
            }}
            loading="lazy"
          />
        )
      ) : media.type === "video" ? (
        <>
          <video
            src={thumbnailUrl}
            className="w-full h-full object-cover"
            controls={false}
            muted
            preload="metadata"
            playsInline
            loop
          />
          {/* Play button overlay for videos */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className={`${
                layout === "single" ? "w-16 h-16" : "w-8 h-8"
              } bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity`}
            >
              <div
                className={`w-0 h-0 border-l-[${
                  layout === "single" ? "14px" : "8px"
                }] border-l-white border-t-[${
                  layout === "single" ? "8px" : "5px"
                }] border-t-transparent border-b-[${
                  layout === "single" ? "8px" : "5px"
                }] border-b-transparent ml-${
                  layout === "single" ? "1" : "0.5"
                }`}
              />
            </div>
          </div>
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center p-4">
          <FileQuestion size={40} className="text-gray-500" />
        </div>
      )}

      {/* Show media title if available */}
      {media.title && !showMoreOverlay && (
        <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-gradient-to-t from-black/60 via-black/40 to-transparent pointer-events-none group-hover:pb-7 transition-all duration-200 ease-in-out z-5">
          <h4 className="text-[10px] md:text-xs font-medium text-white truncate group-hover:text-blue-300 transition-colors">
            {media.title}
          </h4>
        </div>
      )}

      {/* Reaction Selector (shows based on local state) */}
      <AnimatePresence>
        {isSelectorVisible && (
          <div
            className="absolute left-2 bottom-10 z-30"
            // Keep selector open when mouse moves onto it
            onMouseEnter={() => {
              if (hideTimeoutRef.current) {
                clearTimeout(hideTimeoutRef.current);
                hideTimeoutRef.current = null;
              }
            }}
            onMouseLeave={() => {
              // Hide after a delay when leaving selector itself
              hideTimeoutRef.current = setTimeout(() => {
                setIsSelectorVisible(false);
              }, 150);
            }}
            onClick={(e) => e.stopPropagation()} // Prevent clicks inside selector from closing it prematurely
          >
            <ReactionSelector
              isVisible={true} // Controlled by AnimatePresence
              onSelect={(reaction) => {
                onMediaReactionSelect(mediaId, reaction);
                // Immediately hide after selection
                setIsSelectorVisible(false);
                if (hideTimeoutRef.current) {
                  clearTimeout(hideTimeoutRef.current);
                  hideTimeoutRef.current = null;
                }
              }}
            />
          </div>
        )}
      </AnimatePresence>

      {/* Hover Toolbar */}
      <div className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-between bg-gradient-to-t from-black/60 via-black/40 to-transparent p-1 opacity-0 transition-opacity duration-200 ease-in-out group-hover:opacity-100">
        {/* Left side - Reactions */}
        <div
          className="relative z-20"
          onMouseEnter={(e) => {
            e.stopPropagation();
            e.preventDefault();
            // Clear any pending hide timeout
            if (hideTimeoutRef.current) {
              clearTimeout(hideTimeoutRef.current);
              hideTimeoutRef.current = null;
            }
            // Show the selector
            setIsSelectorVisible(true);
          }}
          onMouseLeave={(e) => {
            e.stopPropagation();
            e.preventDefault();
            // Hide after a delay
            hideTimeoutRef.current = setTimeout(() => {
              setIsSelectorVisible(false);
            }, 150);
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMediaReactionSelect(
                mediaId,
                currentMediaReaction ? null : "LIKE"
              );
              // Optionally hide selector on simple heart click too
              setIsSelectorVisible(false);
              if (hideTimeoutRef.current) {
                clearTimeout(hideTimeoutRef.current);
                hideTimeoutRef.current = null;
              }
            }}
            className={`text-white/80 hover:text-white p-1 ml-0.5 mb-0.5 rounded-full bg-black/30 hover:bg-black/50 transition-colors cursor-pointer ${
              currentMediaReaction ? "text-blue-400" : ""
            }`}
            title={currentMediaReaction ? "Change Reaction" : "React"}
          >
            <Heart
              size={layout === "single" ? 16 : 14}
              className={currentMediaReaction ? "fill-current" : ""}
            />
          </button>

          {/* Show reaction counts if any */}
          {totalMediaReactions > 0 && (
            <span className="text-xs text-white ml-1">
              {totalMediaReactions}
            </span>
          )}
        </div>

        {/* Right side - View Full Size */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick(media, apiBaseUrl, postId, index, allMedia);
          }}
          className="text-white/80 hover:text-white p-1 mr-0.5 mb-0.5 rounded-full bg-black/30 hover:bg-black/50 transition-colors cursor-pointer"
          title="View Full Size"
        >
          <Maximize size={layout === "single" ? 16 : 14} />
        </button>
      </div>
    </motion.div>
  );
};

// Optimize with React.memo and custom comparison
const areEqual = (
  prevProps: MediaThumbnailProps,
  nextProps: MediaThumbnailProps
) => {
  // No longer need to check activeMediaReactionSelector state

  // Core properties that should trigger re-renders when changed
  if (
    prevProps.media.media !== nextProps.media.media ||
    prevProps.media.type !== nextProps.media.type ||
    prevProps.media.title !== nextProps.media.title ||
    prevProps.media.source !== nextProps.media.source ||
    prevProps.apiBaseUrl !== nextProps.apiBaseUrl ||
    prevProps.index !== nextProps.index ||
    prevProps.showMoreOverlay !== nextProps.showMoreOverlay ||
    prevProps.totalHidden !== nextProps.totalHidden ||
    prevProps.postId !== nextProps.postId ||
    prevProps.layout !== nextProps.layout ||
    prevProps.currentMediaReaction !== nextProps.currentMediaReaction
  ) {
    return false;
  }

  // Check mediaReactionCounts
  const prevCountKeys = Object.keys(prevProps.mediaReactionCounts || {});
  const nextCountKeys = Object.keys(nextProps.mediaReactionCounts || {});

  if (prevCountKeys.length !== nextCountKeys.length) return false;

  for (const key of prevCountKeys) {
    if (
      (prevProps.mediaReactionCounts?.[key as ReactionType] || 0) !==
      (nextProps.mediaReactionCounts?.[key as ReactionType] || 0)
    ) {
      return false;
    }
  }

  // Check allMedia length if it exists
  if ((prevProps.allMedia?.length || 0) !== (nextProps.allMedia?.length || 0)) {
    return false;
  }

  // If we reach here, consider the props equal (no re-render needed)
  return true;
};

export default memo(MediaThumbnail, areEqual);
