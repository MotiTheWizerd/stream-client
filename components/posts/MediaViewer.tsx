import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Volume2,
  VolumeX,
  Download,
  ZoomIn,
  ZoomOut,
  RotateCw,
} from "lucide-react";
import { MediaItem } from "../../types/posts";

export interface MediaViewerProps {
  isOpen: boolean;
  initialMedia: {
    url: string;
    type: "image" | "video" | "unknown";
    title: string;
  } | null;
  initialMediaContext: {
    postId: string;
    mediaIndex: number;
    mediaItems: MediaItem[];
  } | null;
  onClose: () => void;
  apiBaseUrl: string;
}

const MediaViewer: React.FC<MediaViewerProps> = ({
  isOpen,
  initialMedia,
  initialMediaContext,
  onClose,
  apiBaseUrl,
}) => {
  // Media viewer state
  const [activeMedia, setActiveMedia] = useState(initialMedia);
  const [isMuted, setIsMuted] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [slideDirection, setSlideDirection] = useState<"left" | "right" | null>(
    null
  );
  const [currentPostMedia, setCurrentPostMedia] = useState(initialMediaContext);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Update state when props change
  useEffect(() => {
    setActiveMedia(initialMedia);
    setCurrentPostMedia(initialMediaContext);
  }, [initialMedia, initialMediaContext]);

  // Reset state when closed
  useEffect(() => {
    if (!isOpen) {
      setIsMuted(true);
      setIsZoomed(false);
      setRotation(0);
      setSlideDirection(null);
    }
  }, [isOpen]);

  // Add keyboard event listener for arrow navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activeMedia || !currentPostMedia) return;

      if (e.key === "ArrowLeft") {
        navigateMedia("prev");
      } else if (e.key === "ArrowRight") {
        navigateMedia("next");
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      // Prevent scrolling while viewer is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      // Restore scrolling when component unmounts or viewer closes
      document.body.style.overflow = "auto";
    };
  }, [activeMedia, currentPostMedia, isOpen]);

  const navigateMedia = (direction: "prev" | "next") => {
    if (!currentPostMedia) return;
    if (!apiBaseUrl) {
      console.error(
        "Error: API base URL is not configured for media navigation."
      );
      return;
    }

    const { mediaIndex, mediaItems } = currentPostMedia;
    let newIndex =
      direction === "next"
        ? (mediaIndex + 1) % mediaItems.length
        : (mediaIndex - 1 + mediaItems.length) % mediaItems.length;

    const nextMedia = mediaItems[newIndex];

    // Set slide direction for animation
    setSlideDirection(direction === "next" ? "left" : "right");

    // Update media viewer with the new media
    const mediaUrl =
      nextMedia.source === "link"
        ? nextMedia.media
        : `${apiBaseUrl}${nextMedia.media}`;

    setActiveMedia({
      url: mediaUrl,
      type:
        nextMedia.type === "image" || nextMedia.type === "video"
          ? nextMedia.type
          : "unknown",
      title: nextMedia.title || "Media",
    });

    // Reset zoom and rotation
    setIsZoomed(false);
    setRotation(0);

    // Update current media index
    setCurrentPostMedia({
      ...currentPostMedia,
      mediaIndex: newIndex,
    });

    // Reset slide direction after animation
    setTimeout(() => {
      setSlideDirection(null);
    }, 300);
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
    }
  };

  const toggleZoom = () => {
    setIsZoomed((prev) => !prev);
  };

  const rotateImage = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const downloadMedia = () => {
    if (!activeMedia) return;

    const a = document.createElement("a");
    a.href = activeMedia.url;
    a.download = `${activeMedia.title || "download"}.${
      activeMedia.type === "image" ? "jpg" : "mp4"
    }`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Don't render anything if not open
  if (!isOpen || !activeMedia) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center media-viewer-container"
        onClick={onClose}
      >
        {/* Close button */}
        <motion.button
          className="absolute top-4 right-4 z-10 text-white bg-black/50 hover:bg-black/70 rounded-full p-2 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          <X size={24} />
        </motion.button>

        {/* Navigation Arrows (Only show if we have multiple media) */}
        {currentPostMedia && currentPostMedia.mediaItems.length > 1 && (
          <>
            {/* Left Arrow */}
            <motion.button
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white bg-black/50 hover:bg-black/70 rounded-full p-4 transition-colors media-viewer-nav-button"
              whileHover={{ scale: 1.1, x: -5 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                navigateMedia("prev");
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </motion.button>

            {/* Right Arrow */}
            <motion.button
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white bg-black/50 hover:bg-black/70 rounded-full p-4 transition-colors media-viewer-nav-button"
              whileHover={{ scale: 1.1, x: 5 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                navigateMedia("next");
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </motion.button>

            {/* Media Counter */}
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-black/50 rounded-full px-4 py-2 text-white text-sm font-medium media-counter">
              {currentPostMedia.mediaIndex + 1} /{" "}
              {currentPostMedia.mediaItems.length}
            </div>
          </>
        )}

        {/* Media Controls */}
        <motion.div
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 bg-black/50 backdrop-blur-md rounded-full px-4 py-2 z-10"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {activeMedia.type === "video" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleMute();
              }}
              className="text-white hover:text-blue-400 transition-colors"
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
          )}

          {activeMedia.type === "image" && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleZoom();
                }}
                className="text-white hover:text-blue-400 transition-colors"
              >
                {isZoomed ? <ZoomOut size={20} /> : <ZoomIn size={20} />}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  rotateImage();
                }}
                className="text-white hover:text-blue-400 transition-colors"
              >
                <RotateCw size={20} />
              </button>
            </>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              downloadMedia();
            }}
            className="text-white hover:text-blue-400 transition-colors"
          >
            <Download size={20} />
          </button>
        </motion.div>

        {/* Media Title/Caption */}
        <motion.div
          className="absolute top-4 left-4 max-w-3xl p-4 bg-black/50 backdrop-blur-md rounded-lg text-white z-10"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-xl font-medium">{activeMedia.title}</h3>
        </motion.div>

        {/* Media Content Container */}
        <motion.div
          className={`relative max-w-full max-h-screen p-1 ${
            slideDirection === "left"
              ? "slide-in-left"
              : slideDirection === "right"
              ? "slide-in-right"
              : ""
          }`}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          // Add touch gesture support
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = offset.x;
            if (currentPostMedia && currentPostMedia.mediaItems.length > 1) {
              if (swipe < -50) {
                navigateMedia("next");
              } else if (swipe > 50) {
                navigateMedia("prev");
              }
            }
          }}
        >
          {activeMedia.type === "image" && (
            <div
              className="relative w-full h-full flex items-center justify-center"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: "transform 0.3s ease-in-out",
              }}
            >
              <img
                src={activeMedia.url}
                alt={activeMedia.title}
                className={`max-h-[95vh] max-w-[98vw] object-contain rounded-lg shadow-2xl ${
                  isZoomed ? "cursor-zoom-out scale-150" : "cursor-zoom-in"
                }`}
                style={{
                  transition: "transform 0.3s ease-in-out",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleZoom();
                }}
              />
            </div>
          )}

          {activeMedia.type === "video" && (
            <div className="relative w-full h-full flex items-center justify-center">
              <video
                ref={videoRef}
                src={activeMedia.url}
                className="max-h-[95vh] max-w-[98vw] object-contain rounded-lg shadow-2xl"
                autoPlay
                loop
                muted={isMuted}
                controls={true}
                playsInline
                controlsList="nodownload"
                onClick={(e) => e.stopPropagation()}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MediaViewer;
