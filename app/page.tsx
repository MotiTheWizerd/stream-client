"use client";
import React, { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FeaturedContent from "./components/FeaturedContent";
import CategoryList from "./components/CategoryList";
import TrendingStreams from "./components/TrendingStreams";
import LiveChannels from "./components/LiveChannels";
import UsersPosts, { Post } from "../components/posts/UsersPosts";
import { ReactionType } from "../components/ReactionSelector";
import Footer from "./components/Footer";
// Import Redux hooks
import { useAppSelector } from "@/lib/redux/hooks";

// Import the helpers from the new common location
import {
  LoadingSpinner,
  ErrorMessage,
  EmptyPostsState,
} from "./components/common/StateIndicators";

export default function Home() {
  // Get auth data from Redux instead of localStorage
  const { user: currentUser, token } = useAppSelector((state) => state.user);
  const currentUserId = currentUser?.id || null;

  // State for posts data, loading, and error
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState<boolean>(true);
  const [postsError, setPostsError] = useState<string | null>(null);

  // Log Redux auth state for debugging
  useEffect(() => {
    console.log("Current user from Redux:", currentUserId || "Not logged in");
    console.log("Auth token from Redux:", token ? "Found" : "Not found");
  }, [currentUserId, token]);

  // API base URL (can be defined outside component if static)
  const apiBaseUrl = process.env.NEXT_PUBLIC_SERVER_URL;

  // Fetch posts logic (moved from UsersPosts)
  const fetchPosts = useCallback(async () => {
    setIsLoadingPosts(true);
    setPostsError(null);
    try {
      console.log("Fetching posts with auth token:", token ? "Yes" : "No");

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
        console.log("Adding Authorization header for posts fetch");
      }

      // TODO: Consider if you want to fetch all posts here or filter
      // e.g., fetch only public posts if no token, or use a specific endpoint
      const response = await fetch(`${apiBaseUrl}/api/posts`, {
        headers,
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch posts. Status: ${response.status}`);
      }
      const data: Post[] = await response.json();
      setPosts(data);
      console.log(`Fetched ${data.length} posts successfully`);
    } catch (err: any) {
      console.error("Error fetching posts in Home page:", err);
      setPostsError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoadingPosts(false);
    }
  }, [apiBaseUrl, token]); // Use token from Redux

  // Trigger fetchPosts when component mounts or token changes
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // --- Handler for Reaction Updates from UsersPosts component ---
  const handlePostReactionUpdate = useCallback(
    (
      postId: string,
      newReactionCounts: Record<ReactionType, number>,
      newUserReaction: ReactionType | null
    ) => {
      setPosts((currentPosts) =>
        currentPosts.map((post) => {
          if (post.id === postId) {
            // Return a new post object with updated reaction data
            return {
              ...post,
              reactionCounts: newReactionCounts,
              userReaction: newUserReaction,
            };
          }
          // Return the unchanged post if the ID doesn't match
          return post;
        })
      );
    },
    [] // No dependencies needed as setPosts is stable
  );

  return (
    <>
      <Head>
        <title>StreamHub - Live Entertainment Platform</title>
        <meta
          name="description"
          content="Watch and discover your favorite streams and content creators"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
        <main className="container mx-auto px-4 py-8">
          <Hero />
          <section className="my-12">
            <h2 className="text-2xl font-bold mb-6">Recent Posts</h2>
            {/* Conditionally render based on loading/error/empty state */}
            {isLoadingPosts ? (
              <LoadingSpinner />
            ) : postsError ? (
              <ErrorMessage message={postsError} />
            ) : posts.length === 0 ? (
              <EmptyPostsState />
            ) : (
              <UsersPosts
                currentUserId={currentUserId}
                authToken={token}
                posts={posts} // Pass fetched posts
                onReactionUpdate={handlePostReactionUpdate} // Pass the handler down
              />
            )}
          </section>
          <section className="my-12">
            <h2 className="text-2xl font-bold mb-6">Featured Content</h2>
            <FeaturedContent />
          </section>
          <section className="my-12">
            <h2 className="text-2xl font-bold mb-6">Browse Categories</h2>
            <CategoryList />
          </section>
          <section className="my-12">
            <h2 className="text-2xl font-bold mb-6">Trending Now</h2>
            <TrendingStreams />
          </section>
          <section className="my-12">
            <h2 className="text-2xl font-bold mb-6">Live Channels</h2>
            <LiveChannels />
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}
