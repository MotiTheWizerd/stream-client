import { useState, useCallback } from "react";
import { Comment } from "../types/posts";

interface UseCommentsProps {
  initialComments: Record<string, Comment[]>;
  authToken?: string | null;
  apiBaseUrl: string;
}

const useComments = ({
  initialComments,
  authToken,
  apiBaseUrl,
}: UseCommentsProps) => {
  const [postComments, setPostComments] = useState<Record<string, Comment[]>>(
    initialComments || {}
  );
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>(
    {}
  );
  const [commentLoading, setCommentLoading] = useState<Record<string, boolean>>(
    {}
  );

  // Handle comment input change
  const handleCommentChange = useCallback((postId: string, value: string) => {
    setCommentInputs((prev) => ({ ...prev, [postId]: value }));
  }, []);

  // Handle comment submission
  const handleCommentSubmit = useCallback(
    async (postId: string) => {
      // Check for required dependencies
      if (!apiBaseUrl) {
        console.error("API Base URL is not available!");
        return;
      }

      const content = commentInputs[postId]?.trim();
      if (!content) return; // Don't submit empty comments

      setCommentLoading((prev) => ({ ...prev, [postId]: true }));

      try {
        // Debug log
        console.log(
          "Comment submission - Using auth token:",
          authToken ? "Yes (from props)" : "No (from props)"
        );

        // IMPORTANT: Directly use the authToken from props instead of relying on the api interceptor
        const response = await fetch(
          `${apiBaseUrl}/api/posts/${postId}/comments`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: authToken ? `Bearer ${authToken}` : "",
            },
            body: JSON.stringify({ content }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error ||
              `Failed to post comment. Status: ${response.status}`
          );
        }

        const newComment = await response.json();

        // Update comments state (append new comment)
        setPostComments((prev) => ({
          ...prev,
          [postId]: [...(prev[postId] || []), newComment],
        }));

        // Clear the input field for this post
        setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
      } catch (err: any) {
        console.error("Error posting comment:", err);
        // Additional error logging
        if (err.response) {
          console.error("Response status:", err.response.status);
          console.error("Response data:", err.response.data);
        }
        // TODO: Show user feedback (e.g., toast notification)
      } finally {
        setCommentLoading((prev) => ({ ...prev, [postId]: false })); // Reset loading state
      }
    },
    [apiBaseUrl, authToken, commentInputs]
  );

  // Initialize comments state for new posts
  const initializePostComments = useCallback((posts: any[]) => {
    const initialCommentInputs: Record<string, string> = {};
    const initialCommentLoading: Record<string, boolean> = {};
    const initialPostComments: Record<string, Comment[]> = {};

    posts.forEach((post) => {
      if (post.comments) {
        initialPostComments[post.id] = post.comments;
      }
      initialCommentInputs[post.id] = "";
      initialCommentLoading[post.id] = false;
    });

    setPostComments((prev) => ({ ...prev, ...initialPostComments }));
    setCommentInputs((prev) => ({ ...prev, ...initialCommentInputs }));
    setCommentLoading((prev) => ({ ...prev, ...initialCommentLoading }));
  }, []);

  return {
    postComments,
    commentInputs,
    commentLoading,
    handleCommentChange,
    handleCommentSubmit,
    initializePostComments,
  };
};

export default useComments;
