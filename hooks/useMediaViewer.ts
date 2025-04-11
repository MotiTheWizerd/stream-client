import { useState, useCallback } from "react";
import { MediaItem } from "../types/posts";

interface UseMediaViewerProps {
  apiBaseUrl: string;
}

interface ViewerMedia {
  url: string;
  type: "image" | "video" | "unknown";
  title: string;
}

interface ViewerMediaContext {
  postId: string;
  mediaIndex: number;
  mediaItems: MediaItem[];
}

const useMediaViewer = ({ apiBaseUrl }: UseMediaViewerProps) => {
  // Media viewer state
  const [viewerMedia, setViewerMedia] = useState<ViewerMedia | null>(null);
  const [viewerMediaContext, setViewerMediaContext] =
    useState<ViewerMediaContext | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  // Media viewer functions
  const openMediaViewer = useCallback(
    (
      media: MediaItem,
      apiBaseUrl: string,
      postId?: string,
      mediaIndex?: number,
      allMedia?: MediaItem[]
    ) => {
      if (!apiBaseUrl) {
        console.error(
          "Error: API base URL is not configured for opening media."
        );
        return;
      }
      const mediaUrl =
        media.source === "link" ? media.media : `${apiBaseUrl}${media.media}`;

      const viewerType =
        media.source === "link" &&
        media.type !== "image" &&
        media.type !== "video"
          ? "unknown"
          : (media.type as "image" | "video" | "unknown");

      setViewerMedia({
        url: mediaUrl,
        type: viewerType,
        title: media.title || "Media",
      });
      setIsViewerOpen(true);

      // Set current post media for navigation
      if (postId && allMedia && typeof mediaIndex === "number") {
        setViewerMediaContext({
          postId,
          mediaIndex,
          mediaItems: allMedia,
        });
      }
    },
    []
  );

  const closeMediaViewer = useCallback(() => {
    setViewerMedia(null);
    setIsViewerOpen(false);
    setViewerMediaContext(null);
  }, []);

  return {
    viewerMedia,
    viewerMediaContext,
    isViewerOpen,
    openMediaViewer,
    closeMediaViewer,
  };
};

export default useMediaViewer;
