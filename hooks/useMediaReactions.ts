import { useState, useCallback, useRef } from "react";
import { MediaItem } from "../types/posts";
import { ReactionType } from "../components/ReactionSelector";

interface UseMediaReactionsProps {
  mediaItems: MediaItem[];
  apiBaseUrl: string;
  authToken?: string | null;
  onMediaReactionUpdate?: (
    mediaId: string,
    reactionCounts: Record<ReactionType, number>,
    userReaction: ReactionType | null
  ) => void;
}

const useMediaReactions = ({
  mediaItems,
  apiBaseUrl,
  authToken,
  onMediaReactionUpdate,
}: UseMediaReactionsProps) => {
  // State for user reactions on media items
  const [userMediaReactions, setUserMediaReactions] = useState<
    Record<string, ReactionType | null>
  >(() => {
    const initialReactions: Record<string, ReactionType | null> = {};
    mediaItems.forEach((media) => {
      if (media.mediaId) {
        initialReactions[media.mediaId] = media.userMediaReaction || null;
      }
    });
    return initialReactions;
  });

  // State for temporary optimistic reaction counts
  const [optimisticMediaReactionCounts, setOptimisticMediaReactionCounts] =
    useState<Record<string, Record<ReactionType, number>>>({});

  // Track the last activated media ID to prevent race conditions
  const lastMediaIdRef = useRef<string | null>(null);

  // Handle selecting a reaction for media
  const handleMediaReactionSelect = useCallback(
    async (mediaId: string, reaction: ReactionType | null) => {
      // Check if we have the required dependencies
      if (!apiBaseUrl || !mediaId) {
        console.error("API Base URL or Media ID is not available!");
        return;
      }

      const mediaItem = mediaItems.find((m) => m.mediaId === mediaId);
      if (!mediaItem) return;

      const previousReaction = userMediaReactions[mediaId];
      const newReaction = reaction;

      // --- Optimistic UI Update ---
      setUserMediaReactions((prev) => ({ ...prev, [mediaId]: newReaction }));

      // Calculate and set optimistic counts
      const currentCounts =
        optimisticMediaReactionCounts[mediaId] ??
        mediaItem.mediaReactionCounts ??
        {};
      const updatedCounts = { ...currentCounts };

      // Decrement previous reaction count if it existed
      if (previousReaction && updatedCounts[previousReaction]) {
        updatedCounts[previousReaction] = Math.max(
          0,
          updatedCounts[previousReaction] - 1
        );
      }
      // Increment new reaction count if it exists
      if (newReaction) {
        updatedCounts[newReaction] = (updatedCounts[newReaction] || 0) + 1;
      }
      setOptimisticMediaReactionCounts((prev) => ({
        ...prev,
        [mediaId]: updatedCounts,
      }));
      // --- End Optimistic UI Update ---

      // --- Server Request ---
      try {
        const response = await fetch(
          `${apiBaseUrl}/api/media/${mediaId}/reactions`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: authToken ? `Bearer ${authToken}` : "",
            },
            body: JSON.stringify({ reactionType: reaction }),
          }
        );

        if (!response.ok) {
          console.error(
            "Server failed to update media reaction. Reverting UI."
          );
          // Revert local optimistic state
          setUserMediaReactions((prev) => ({
            ...prev,
            [mediaId]: previousReaction,
          }));
          // Clear optimistic counts
          setOptimisticMediaReactionCounts((prev) => {
            const newState = { ...prev };
            delete newState[mediaId];
            return newState;
          });

          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error ||
              `Failed to save media reaction. Status: ${response.status}`
          );
        }

        // --- Process successful response ---
        const updatedData = await response.json();

        if (
          updatedData &&
          updatedData.reactionCounts !== undefined &&
          updatedData.userReaction !== undefined
        ) {
          // Trigger parent component to update
          onMediaReactionUpdate?.(
            mediaId,
            updatedData.reactionCounts,
            updatedData.userReaction
          );
          // Clear optimistic counts
          setOptimisticMediaReactionCounts((prev) => {
            const newState = { ...prev };
            delete newState[mediaId];
            return newState;
          });
        }
      } catch (error) {
        console.error("Error saving media reaction:", error);
        // Revert local optimistic state
        setUserMediaReactions((prev) => ({
          ...prev,
          [mediaId]: previousReaction,
        }));
        // Clear optimistic counts
        setOptimisticMediaReactionCounts((prev) => {
          const newState = { ...prev };
          delete newState[mediaId];
          return newState;
        });
      }
    },
    [
      mediaItems,
      onMediaReactionUpdate,
      optimisticMediaReactionCounts,
      userMediaReactions,
      authToken,
      apiBaseUrl,
    ]
  );

  return {
    userMediaReactions,
    optimisticMediaReactionCounts,
    handleMediaReactionSelect,
  };
};

export default useMediaReactions;
