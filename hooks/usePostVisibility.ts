import { useCallback } from "react";
import { Post } from "../types/posts";

interface UsePostVisibilityProps {
  currentUserId?: string | null;
}

const usePostVisibility = ({ currentUserId }: UsePostVisibilityProps) => {
  // Memoize the visibility check function
  const isPostContentVisible = useCallback(
    (post: Post): boolean => {
      if (!currentUserId) {
        return post.visibility === "PUBLIC";
      }

      const isPublic = post.visibility === "PUBLIC";
      const isOwnSubscriberPost =
        post.visibility === "SUBSCRIBERS" && post.authorId === currentUserId;

      return isPublic || isOwnSubscriberPost;
    },
    [currentUserId]
  );

  return {
    isPostContentVisible,
  };
};

export default usePostVisibility;
