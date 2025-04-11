"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Info, Calendar, MessageSquare, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppSelector } from "@/lib/redux/hooks";
import toast from "react-hot-toast";

import { useUserProfile } from "@/app/hooks/useUserProfile";
import { useUserPosts } from "@/app/hooks/useUserPosts";
import { useFollowUser } from "@/app/hooks/useFollowUser";

import UserProfileLoading from "./UserComponents/UserProfileLoading";
import UserProfileNotFound from "./UserComponents/UserProfileNotFound";
import UserProfileBanner from "./UserComponents/UserProfileBanner";
import UserProfileHeader from "./UserComponents/UserProfileHeader";
import UserProfileTabs from "./UserComponents/UserProfileTabs";
import UserProfileVideosTab from "./UserComponents/UserProfileVideosTab";
import UserProfileAboutTab from "./UserComponents/UserProfileAboutTab";
import UserProfileScheduleTab from "./UserComponents/UserProfileScheduleTab";
import UserProfileMessagesTab from "./UserComponents/UserProfileMessagesTab";
import NewUserPost from "@/components/NewUserPost";
import PostsSection from "./UserComponents/PostsSection";

import { ReactionType } from "@/components/ReactionSelector";
import { ProfileData } from "@/app/types/profile";

interface UserProfileProps {
  userId: string;
}

const UserProfile = ({ userId }: UserProfileProps) => {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "posts";
  const router = useRouter();
  const {
    user: currentUser,
    token,
    isAuthenticated,
  } = useAppSelector((state) => state.user);

  const isOwnProfile = currentUser?.id === userId;

  const {
    profileData,
    setProfileData,
    loading: isLoadingProfile,
    error: profileError,
  } = useUserProfile(userId);

  const { posts, setPosts, isLoadingPosts, postsError, fetchPosts } =
    useUserPosts(userId);

  const { isFollowingStatus, handleFollowUser, handleUnfollowUser } =
    useFollowUser(profileData?.isFollowing, profileData, setProfileData);

  const [activeTab, setActiveTab] = useState(initialTab);
  const [isCreatingPost, setIsCreatingPost] = useState(false);

  useEffect(() => {
    if (activeTab === "messages" && !isOwnProfile) {
      setActiveTab("about");
      toast.error("Messages are only available on your own profile.");
      router.replace(`/profile/${userId}?tab=about`, { scroll: false });
    }
  }, [activeTab, isOwnProfile, userId, router]);

  useEffect(() => {
    if (profileData && activeTab !== initialTab) {
      router.replace(`/profile/${userId}?tab=${activeTab}`, { scroll: false });
    }
  }, [activeTab, userId, router, profileData]);

  const handleOpenCreatePost = () => {
    if (!currentUser?.isCreator) {
      toast.error("Only approved creators can create posts.");
      return;
    }
    setIsCreatingPost(true);
  };

  const handleCloseCreatePost = useCallback(() => {
    setIsCreatingPost(false);
  }, []);

  const handlePostSuccess = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    toast.success("Post created successfully!");
    fetchPosts();
    handleCloseCreatePost();
  }, [handleCloseCreatePost, fetchPosts]);

  const handlePostReactionUpdate = useCallback(
    (
      postId: string,
      newReactionCounts: Record<ReactionType, number>,
      newUserReaction: ReactionType | null
    ) => {
      setPosts((currentPosts) =>
        currentPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                reactionCounts: newReactionCounts,
                userReaction: newUserReaction,
              }
            : post
        )
      );
    },
    [setPosts]
  );

  if (isLoadingProfile) {
    return <UserProfileLoading />;
  }

  if (profileError || !profileData) {
    return <UserProfileNotFound />;
  }

  const bannerUrl = profileData.banner || "/default-banner.jpg";

  const baseTabs = [
    { id: "about", label: "About", icon: <Info size={18} /> },
    { id: "posts", label: "Posts", icon: <MessageSquare size={18} /> },
    { id: "schedule", label: "Schedule", icon: <Calendar size={18} /> },
  ];

  const tabs = isOwnProfile
    ? [
        ...baseTabs,
        { id: "messages", label: "Messages", icon: <Mail size={18} /> },
      ]
    : baseTabs;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white">
      <UserProfileBanner bannerUrl={bannerUrl} />

      <motion.div
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 relative"
      >
        <UserProfileHeader
          userId={userId}
          profileData={profileData}
          currentUser={currentUser}
          isFollowing={isFollowingStatus}
          handleFollowUser={handleFollowUser}
          handleUnfollowUser={handleUnfollowUser}
          handleOpenCreatePost={handleOpenCreatePost}
          setProfileData={setProfileData}
        />

        <UserProfileTabs
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {isOwnProfile && (
          <div className="my-4 flex flex-col">
            <AnimatePresence>
              {isCreatingPost && (
                <motion.div
                  className="w-full"
                  initial={{ height: 0, opacity: 0, marginTop: 0 }}
                  animate={{ height: "auto", opacity: 1, marginTop: "1rem" }}
                  exit={{ height: 0, opacity: 0, marginTop: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <NewUserPost
                    onClose={handleCloseCreatePost}
                    token={token}
                    onPostSuccess={handlePostSuccess}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        <div className="py-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="mt-8"
            >
              {activeTab === "videos" && <UserProfileVideosTab />}
              {activeTab === "about" && (
                <UserProfileAboutTab
                  name={profileData.username}
                  bio={profileData.bio || ""}
                />
              )}
              {activeTab === "schedule" && <UserProfileScheduleTab />}
              {activeTab === "messages" && isOwnProfile && (
                <UserProfileMessagesTab userId={userId} />
              )}
              {activeTab === "posts" && (
                <PostsSection
                  posts={posts}
                  isLoading={isLoadingPosts}
                  error={postsError}
                  currentUserId={currentUser?.id || null}
                  authToken={token}
                  onReactionUpdate={handlePostReactionUpdate}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default UserProfile;
