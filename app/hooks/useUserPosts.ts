import { useState, useEffect, useCallback } from "react";
import { Post } from "@/components/posts/UsersPosts"; // Assuming Post type is exported from here
import { useAppSelector } from "@/lib/redux/hooks";

export function useUserPosts(userId: string) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [postsError, setPostsError] = useState<string | null>(null);
  const { token } = useAppSelector((state) => state.user);
  const apiBaseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "";

  const fetchPosts = useCallback(async () => {
    if (!userId) return;
    console.log(`Fetching posts for user: ${userId}`);
    setIsLoadingPosts(true);
    setPostsError(null);
    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      if (!apiBaseUrl) {
        throw new Error("API Base URL not configured for fetching posts");
      }

      const response = await fetch(
        `${apiBaseUrl}/api/posts?authorId=${userId}`,
        {
          headers,
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch user posts. Status: ${response.status}`
        );
      }
      const data: Post[] = await response.json();
      console.log(`Fetched ${data.length} posts for user ${userId}`);
      setPosts(data);
    } catch (err: any) {
      console.error(`Error fetching posts for user ${userId}:`, err);
      setPostsError(
        err.message || "An unexpected error occurred while fetching posts."
      );
      setPosts([]);
    } finally {
      setIsLoadingPosts(false);
    }
  }, [apiBaseUrl, userId, token]);

  useEffect(() => {
    if (userId && token) {
      // Only fetch if userId and token are available
      fetchPosts();
    }
  }, [fetchPosts, userId, token]);

  return { posts, setPosts, isLoadingPosts, postsError, fetchPosts };
}
