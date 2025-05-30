import { useState, useCallback, useRef, useEffect } from "react";
import { ClientPostMediaItem } from "../types/posts";
import { ReactionType } from "../components/ReactionSelector";

interface UseMediaReactionsProps {
  mediaItems: ClientPostMediaItem[];
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
  >({});

  // State for reaction counts (both server-confirmed and optimistic)
  const [mediaReactionCounts, setMediaReactionCounts] = useState<
    Record<string, Record<ReactionType, number>>
  >({});

  // Track the last activated media ID to prevent race conditions
  const lastMediaIdRef = useRef<string | null>(null);

  // Keep track of whether we've initialized
  const isInitializedRef = useRef(false);

  // Initialize media reactions from mediaItems
  useEffect(() => {
    // Only run this once on initial render
    if (isInitializedRef.current || !mediaItems.length) return;
    isInitializedRef.current = true;

    const initialUserReactions: Record<string, ReactionType | null> = {};
    const initialReactionCounts: Record<
      string,
      Record<ReactionType, number>
    > = {};

    mediaItems.forEach((media) => {
      if (media.id) {
        if (media.userReaction) {
          initialUserReactions[media.id] = media.userReaction;
        }
        if (media.reactionCounts) {
          initialReactionCounts[media.id] = media.reactionCounts;
        }
      }
    });

    if (Object.keys(initialUserReactions).length > 0) {
      setUserMediaReactions(initialUserReactions);
    }

    if (Object.keys(initialReactionCounts).length > 0) {
      setMediaReactionCounts(initialReactionCounts);
    }
  }, [mediaItems]);

  // Handle selecting a reaction for media
  const handleMediaReactionSelect = useCallback(
    async (mediaId: string, reaction: ReactionType | null) => {
      // Check if we have the required dependencies
      if (!apiBaseUrl || !mediaId) {
        console.error("API Base URL or Media ID is not available!");
        return;
      }

      const mediaItem = mediaItems.find((m) => m.id === mediaId);
      if (!mediaItem) return;

      const previousReaction = userMediaReactions[mediaId];
      const newReaction = reaction;

      // --- Optimistic UI Update ---
      setUserMediaReactions((prev) => ({ ...prev, [mediaId]: newReaction }));

      // Calculate and set optimistic counts
      const currentCounts = mediaReactionCounts[mediaId] ?? {
        LIKE: 0,
        LOVE: 0,
        HAHA: 0,
        WOW: 0,
        SAD: 0,
        ANGRY: 0,
      };
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

      // Update media reaction counts with the optimistic update
      setMediaReactionCounts((prev) => ({
        ...prev,
        [mediaId]: updatedCounts,
      }));

      // --- Server Request ---
      try {
        const response = await fetch(
          `${apiBaseUrl}/api/posts/media/${mediaId}/reactions`,
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
          // Update our internal state with server-confirmed data
          setUserMediaReactions((prev) => ({
            ...prev,
            [mediaId]: updatedData.userReaction,
          }));

          setMediaReactionCounts((prev) => ({
            ...prev,
            [mediaId]: updatedData.reactionCounts,
          }));

          // Trigger parent component to update if callback exists
          onMediaReactionUpdate?.(
            mediaId,
            updatedData.reactionCounts,
            updatedData.userReaction
          );
        }
      } catch (error) {
        console.error("Error saving media reaction:", error);
        // Revert local optimistic state
        setUserMediaReactions((prev) => ({
          ...prev,
          [mediaId]: previousReaction,
        }));
      }
    },
    [
      mediaItems,
      onMediaReactionUpdate,
      mediaReactionCounts,
      userMediaReactions,
      authToken,
      apiBaseUrl,
    ]
  );

  return {
    userMediaReactions,
    optimisticMediaReactionCounts: mediaReactionCounts,
    handleMediaReactionSelect,
  };
};

export default useMediaReactions;
