import { useState, useCallback } from "react";
import { Post } from "../types/posts";
import { ReactionType } from "../components/ReactionSelector";

interface UseReactionsProps {
  posts: Post[];
  apiBaseUrl: string;
  authToken?: string | null;
  onReactionUpdate?: (
    postId: string,
    reactionCounts: Record<ReactionType, number>,
    userReaction: ReactionType | null
  ) => void;
}

const useReactions = ({
  posts,
  apiBaseUrl,
  authToken,
  onReactionUpdate,
}: UseReactionsProps) => {
  // State for user reactions on posts
  const [userReactions, setUserReactions] = useState<
    Record<string, ReactionType | null>
  >(() => {
    const initialReactions: Record<string, ReactionType | null> = {};
    posts.forEach((post) => {
      initialReactions[post.id] = post.userReaction || null;
    });
    return initialReactions;
  });

  // State for temporary optimistic reaction counts
  const [optimisticReactionCounts, setOptimisticReactionCounts] = useState<
    Record<string, Record<ReactionType, number>>
  >({});

  // State for the reaction selector UI
  const [activeReactionSelector, setActiveReactionSelector] = useState<
    string | null
  >(null);

  // Track liked state (separate from reactions)
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  // Handle like toggle (separate from reactions system)
  const handleLikeToggle = useCallback((postId: string) => {
    setLikedPosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  }, []);

  // Handle selecting a reaction - with local state update + specific callback
  const handleReactionSelect = useCallback(
    async (postId: string, reaction: ReactionType | null) => {
      // Check if we have the required dependencies
      if (!apiBaseUrl) {
        console.error("API Base URL is not available!");
        return;
      }

      const currentPost = posts.find((p) => p.id === postId);
      if (!currentPost) return;

      // Debug logging
      console.log(
        "Reaction selection - Using auth token:",
        authToken ? "Yes (from props)" : "No (from props)"
      );

      const previousReaction = userReactions[postId];
      const newReaction = reaction; // Use the argument directly

      // --- Optimistic UI Update (Local State for button appearance AND counts) ---
      setUserReactions((prev) => ({ ...prev, [postId]: newReaction }));

      // Calculate and set optimistic counts
      const currentCounts =
        optimisticReactionCounts[postId] ?? currentPost.reactionCounts ?? {};
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
      setOptimisticReactionCounts((prev) => ({
        ...prev,
        [postId]: updatedCounts,
      }));
      // --- End Optimistic UI Update ---

      setActiveReactionSelector(null); // Hide selector immediately

      // --- Server Request with direct fetch instead of api utility ---
      try {
        const response = await fetch(
          `${apiBaseUrl}/api/posts/${postId}/reactions`,
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
          console.error("Server failed to update reaction. Reverting UI.");
          // Revert local optimistic state for button appearance
          setUserReactions((prev) => ({ ...prev, [postId]: previousReaction }));
          // Clear optimistic counts for this post
          setOptimisticReactionCounts((prev) => {
            const newState = { ...prev };
            delete newState[postId];
            return newState;
          });

          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error ||
              `Failed to save reaction. Status: ${response.status}`
          );
        }

        // --- Process successful response ---
        const updatedData = await response.json();

        if (
          updatedData &&
          updatedData.reactionCounts !== undefined &&
          updatedData.userReaction !== undefined
        ) {
          console.log(
            "Reaction updated successfully. Calling onReactionUpdate."
          );
          // Trigger parent component to update specific post data
          onReactionUpdate?.(
            postId,
            updatedData.reactionCounts,
            updatedData.userReaction
          );
          // Clear optimistic counts for this post now that parent has authoritative data
          setOptimisticReactionCounts((prev) => {
            const newState = { ...prev };
            delete newState[postId];
            return newState;
          });
        } else {
          // Fallback if backend response format is unexpected
          console.warn(
            "Reaction successful, but response format unexpected. Parent state might be stale."
          );
        }
      } catch (error) {
        console.error("Error saving reaction:", error);
        // Additional error logging
        if ((error as any).response) {
          console.error("Response status:", (error as any).response.status);
          console.error("Response data:", (error as any).response.data);
        }
        // Revert local optimistic state
        setUserReactions((prev) => ({ ...prev, [postId]: previousReaction }));
        // Clear optimistic counts for this post
        setOptimisticReactionCounts((prev) => {
          const newState = { ...prev };
          delete newState[postId];
          return newState;
        });
        // toast.error("Failed to save reaction.");
      }
    },
    [
      posts,
      onReactionUpdate,
      optimisticReactionCounts,
      userReactions,
      authToken,
      apiBaseUrl,
    ]
  );

  // Show/Hide reaction selector
  let hideSelectorTimeout: NodeJS.Timeout | null = null;

  const showReactionSelector = useCallback((postId: string) => {
    if (hideSelectorTimeout) clearTimeout(hideSelectorTimeout);
    setActiveReactionSelector(postId);
  }, []);

  const hideReactionSelector = useCallback((delay = 250) => {
    // Add a small delay
    hideSelectorTimeout = setTimeout(() => {
      setActiveReactionSelector(null);
    }, delay);
  }, []);

  return {
    userReactions,
    optimisticReactionCounts,
    activeReactionSelector,
    likedPosts,
    handleLikeToggle,
    handleReactionSelect,
    showReactionSelector,
    hideReactionSelector,
  };
};

export default useReactions;
