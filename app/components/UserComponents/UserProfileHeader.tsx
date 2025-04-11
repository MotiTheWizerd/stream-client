"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAppDispatch } from "@/lib/redux/hooks";
import { updateAvatar } from "@/lib/redux/slices/userSlice";
import {
  Twitter,
  Instagram,
  Globe,
  Send,
  Users,
  Video,
  X,
  MessageSquare,
  Edit,
  Heart,
  Share2,
  Bell,
  BarChart3,
} from "lucide-react";
import UserAvatar from "../UserAvatar";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import AvatarUploadModal from "../AvatarUploadModal";

interface UserProfileHeaderProps {
  userId: string;
  profileData: any; // Replace 'any' with a more specific type if available
  currentUser: any; // Replace 'any' with a more specific type
  isFollowing: boolean;
  handleFollowUser: (userId: string) => void;
  handleUnfollowUser: (userId: string) => void;
  handleOpenCreatePost: () => void;
  setProfileData: React.Dispatch<React.SetStateAction<any>>;
}

const UserProfileHeader = ({
  userId,
  profileData,
  currentUser,
  isFollowing,
  handleFollowUser,
  handleUnfollowUser,
  handleOpenCreatePost,
  setProfileData,
}: UserProfileHeaderProps) => {
  const router = useRouter();
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestMessage, setRequestMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAvatarUploadModal, setShowAvatarUploadModal] = useState(false);
  const dispatch = useAppDispatch();

  const apiBaseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "";

  const handleCreatorRequest = async () => {
    setShowRequestModal(true);
  };

  const submitCreatorRequest = async () => {
    try {
      setIsSubmitting(true);
      if (!apiBaseUrl) {
        throw new Error("API Base URL not configured");
      }
      const response = await fetch(`${apiBaseUrl}/api/users/request-creator`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          message: requestMessage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit creator request");
      }

      toast.success(
        "Your creator request has been submitted and is pending approval!"
      );
      setShowRequestModal(false);
      setRequestMessage("");
    } catch (error) {
      console.error("Error submitting creator request:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to submit request. Please try again later."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendMessage = () => {
    router.push(`/messages/compose?recipient=${userId}`);
  };

  // Using the structure derived from the original component's userProfile object
  const userProfile = {
    name: profileData.username,
    username: profileData.username,
    followers: profileData.followerCount
      ? profileData.followerCount.toString()
      : "0",
    following: profileData.followingCount
      ? profileData.followingCount.toString()
      : "0",
    avatar: profileData.avatar,
    isOnline: profileData.isOnline,
    socialLinks: {
      twitter: profileData.username, // Placeholder/Example logic
      instagram: profileData.username, // Placeholder/Example logic
      website: `${profileData.username}.com`, // Placeholder/Example logic
    },
  };

  // Handle avatar update success
  const handleAvatarUpdateSuccess = (newAvatarUrl: string) => {
    // Update local state for the profile header
    setProfileData((prev: any) => ({
      ...prev,
      avatar: newAvatarUrl, // Use the new URL from the server
    }));

    // Update global Redux state for other components (like navbar)
    dispatch(updateAvatar(newAvatarUrl));

    // Show success toast
    toast.success("Profile picture updated successfully!");
  };

  return (
    <div className="relative z-10">
      {/* Avatar Upload Modal */}
      <AvatarUploadModal
        isOpen={showAvatarUploadModal}
        onClose={() => setShowAvatarUploadModal(false)}
        onSuccess={handleAvatarUpdateSuccess}
        userId={userId}
      />

      {/* Glass Card Container */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-gray-900/60 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden border border-gray-800/50"
      >
        <div className="p-6 md:p-8">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8">
            {/* Avatar with Premium Ring */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-blue-500 to-teal-500 rounded-full animate-pulse-slow opacity-70 blur-sm scale-110"></div>
              <div className="relative">
                <UserAvatar
                  user={{
                    id: userId,
                    username: userProfile.name,
                    avatarUrl: userProfile.avatar,
                    isOnline: userProfile.isOnline,
                  }}
                  size="xl"
                  showStatus={true}
                  showUsername={false}
                  className="border-4 border-gray-900"
                  isCurrentUser={currentUser?.id === userId}
                  onEditAvatar={() => setShowAvatarUploadModal(true)}
                />
                {profileData.isCreator && (
                  <div className="absolute top-0 left-0 transform -translate-x-[30%] -translate-y-[30%] group">
                    <div className="relative">
                      <div className="w-5 h-5 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full border-2 border-gray-900 shadow-lg flex items-center justify-center">
                        <span className="text-[10px] text-black">★</span>
                      </div>
                      <div className="absolute inset-0 w-5 h-5 bg-amber-500 rounded-full opacity-30 animate-ping"></div>

                      {/* Tooltip */}
                      <div className="absolute bottom-full left-0 mb-2 w-max opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                        <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 font-medium shadow-lg">
                          Creator
                          <div className="absolute w-2 h-2 bg-gray-900 -bottom-1 left-[10px] transform rotate-45"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* Name & Username */}
                <div>
                  <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2">
                    {userProfile.name}
                    {profileData.isCreator && (
                      <div className="relative group">
                        <span className="inline-block text-lg bg-gradient-to-r from-amber-400 to-amber-600 text-transparent bg-clip-text">
                          ★
                        </span>
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-max opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                          <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 font-medium shadow-lg whitespace-nowrap">
                            Verified Creator
                            <div className="absolute w-2 h-2 bg-gray-900 -bottom-1 left-1/2 -translate-x-1/2 transform rotate-45"></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </h1>
                  <div className="flex items-center mt-1 space-x-2">
                    <p className="text-purple-400 font-medium">
                      @{userProfile.username}
                    </p>
                    {userProfile.isOnline && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/30 text-green-400 border border-green-500/20">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                        Online now
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons Container */}
                <div className="flex flex-wrap gap-3 md:justify-end">
                  {currentUser?.id === userId ? (
                    /* Own Profile Actions */
                    <div className="flex gap-3">
                      {/* Streaming Button */}
                      <div className="relative group">
                        <motion.button
                          whileHover={{
                            scale: !currentUser?.isCreator ? 1 : 1.03,
                          }}
                          whileTap={{
                            scale: !currentUser?.isCreator ? 1 : 0.97,
                          }}
                          onClick={() => router.push("/dashboard/stream")}
                          disabled={!currentUser?.isCreator}
                          className={`flex items-center gap-2 px-5 py-2.5 font-semibold ${
                            !currentUser?.isCreator
                              ? "bg-gray-800/80 text-gray-400 cursor-not-allowed"
                              : "text-white relative overflow-hidden"
                          }`}
                          style={{
                            borderRadius: "0.5rem",
                            boxShadow: !currentUser?.isCreator
                              ? ""
                              : "0 8px 16px -4px rgba(220, 38, 38, 0.2)",
                          }}
                        >
                          {currentUser?.isCreator && (
                            <>
                              <span className="absolute inset-0 bg-gradient-to-r from-red-600 to-rose-500 rounded-xl"></span>
                              <span className="absolute inset-0 bg-gradient-to-r from-red-500 to-rose-400 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                              <span className="absolute -inset-x-3 bottom-0 h-[1px] bg-gradient-to-r from-red-600/0 via-red-600/70 to-red-600/0"></span>
                            </>
                          )}
                          <Video size={18} className="relative z-10" />
                          <span className="relative z-10">Start Streaming</span>
                        </motion.button>
                        {!currentUser?.isCreator && (
                          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 px-3 py-2 text-xs font-medium text-white bg-gray-900 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none w-max z-50">
                            Creator status required
                            <div className="absolute w-3 h-3 bg-gray-900 -bottom-1 left-1/2 transform -translate-x-1/2 rotate-45"></div>
                          </div>
                        )}
                      </div>

                      {/* New Post Button */}
                      <div className="relative group">
                        <motion.button
                          whileHover={{
                            scale: !currentUser?.isCreator ? 1 : 1.03,
                          }}
                          whileTap={{
                            scale: !currentUser?.isCreator ? 1 : 0.97,
                          }}
                          onClick={handleOpenCreatePost}
                          disabled={!currentUser?.isCreator}
                          className={`flex items-center gap-2 px-5 py-2.5 font-semibold ${
                            !currentUser?.isCreator
                              ? "bg-gray-800/80 text-gray-400 cursor-not-allowed"
                              : "text-white relative overflow-hidden"
                          }`}
                          style={{
                            borderRadius: "0.5rem",
                            boxShadow: !currentUser?.isCreator
                              ? ""
                              : "0 8px 16px -4px rgba(59, 130, 246, 0.2)",
                          }}
                        >
                          {currentUser?.isCreator && (
                            <>
                              <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl"></span>
                              <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                              <span className="absolute -inset-x-3 bottom-0 h-[1px] bg-gradient-to-r from-blue-600/0 via-blue-600/70 to-blue-600/0"></span>
                            </>
                          )}
                          <Edit size={18} className="relative z-10" />
                          <span className="relative z-10">New Post</span>
                        </motion.button>
                        {!currentUser?.isCreator && (
                          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 px-3 py-2 text-xs font-medium text-white bg-gray-900 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none w-max z-50">
                            Creator status required
                            <div className="absolute w-3 h-3 bg-gray-900 -bottom-1 left-1/2 transform -translate-x-1/2 rotate-45"></div>
                          </div>
                        )}
                      </div>

                      {/* Request Creator Button */}
                      {!currentUser?.isCreator && (
                        <div className="relative group">
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={handleCreatorRequest}
                            className="flex items-center gap-2 px-5 py-2.5 font-semibold text-white relative overflow-hidden"
                            style={{
                              borderRadius: "0.5rem",
                              boxShadow:
                                "0 8px 16px -4px rgba(16, 185, 129, 0.2)",
                            }}
                          >
                            <span className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-xl"></span>
                            <span className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                            <span className="absolute -inset-x-3 bottom-0 h-[1px] bg-gradient-to-r from-emerald-500/0 via-emerald-500/70 to-emerald-500/0"></span>
                            <BarChart3 size={18} className="relative z-10" />
                            <span className="relative z-10">
                              Request Creator Status
                            </span>
                          </motion.button>
                        </div>
                      )}

                      {/* Edit Profile Button */}
                      <div className="relative group">
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => router.push("/settings/profile")}
                          className="flex items-center justify-center w-11 h-11 relative overflow-hidden"
                          style={{
                            borderRadius: "0.5rem",
                            boxShadow: "0 4px 12px -2px rgba(0, 0, 0, 0.3)",
                          }}
                        >
                          <span className="absolute inset-0 bg-gray-800 rounded-xl"></span>
                          <span className="absolute inset-0 bg-gray-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                          <span className="absolute inset-0 border border-gray-700 rounded-xl"></span>
                          <Edit
                            size={16}
                            className="relative z-10 text-white"
                          />
                        </motion.button>
                      </div>
                    </div>
                  ) : (
                    /* Other User Profile Actions */
                    <div className="flex gap-3">
                      {/* Follow/Unfollow Button */}
                      <div className="relative group">
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() =>
                            isFollowing
                              ? handleUnfollowUser(userId)
                              : handleFollowUser(userId)
                          }
                          className="flex items-center gap-2 px-5 py-2.5 font-semibold text-white relative overflow-hidden"
                          style={{
                            borderRadius: "0.5rem",
                            boxShadow: isFollowing
                              ? ""
                              : "0 8px 16px -4px rgba(124, 58, 237, 0.2)",
                          }}
                        >
                          {isFollowing ? (
                            <>
                              <span className="absolute inset-0 bg-gray-800 rounded-xl"></span>
                              <span className="absolute inset-0 bg-gray-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                              <span className="absolute inset-0 border border-gray-700 rounded-xl"></span>
                            </>
                          ) : (
                            <>
                              <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl"></span>
                              <span className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                              <span className="absolute -inset-x-3 bottom-0 h-[1px] bg-gradient-to-r from-purple-600/0 via-purple-600/70 to-purple-600/0"></span>
                            </>
                          )}
                          <span className="relative z-10">
                            {isFollowing ? "Unfollow" : "Follow"}
                          </span>
                        </motion.button>
                      </div>

                      {/* Message Button */}
                      <div className="relative group">
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={handleSendMessage}
                          className="flex items-center gap-2 px-5 py-2.5 font-semibold text-white relative overflow-hidden"
                          style={{
                            borderRadius: "0.5rem",
                            boxShadow: "0 4px 12px -2px rgba(0, 0, 0, 0.3)",
                          }}
                        >
                          <span className="absolute inset-0 bg-gray-800 rounded-xl"></span>
                          <span className="absolute inset-0 bg-gray-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                          <span className="absolute inset-0 border border-gray-700 rounded-xl"></span>
                          <MessageSquare size={18} className="relative z-10" />
                          <span className="relative z-10">Message</span>
                        </motion.button>
                      </div>

                      {/* Share Button */}
                      <div className="relative group">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="flex items-center justify-center w-11 h-11 relative overflow-hidden"
                          style={{
                            borderRadius: "0.5rem",
                            boxShadow: "0 4px 12px -2px rgba(0, 0, 0, 0.3)",
                          }}
                        >
                          <span className="absolute inset-0 bg-gray-800 rounded-xl"></span>
                          <span className="absolute inset-0 bg-gray-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                          <span className="absolute inset-0 border border-gray-700 rounded-xl"></span>
                          <Share2
                            size={18}
                            className="relative z-10 text-white"
                          />
                        </motion.button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats & Social Links */}
              <div className="mt-6 flex flex-wrap items-center gap-4 md:gap-8">
                {/* Stats */}
                <div className="flex gap-6">
                  <motion.div
                    whileHover={{ y: -2 }}
                    className="flex items-center bg-gray-800/50 px-4 py-2 rounded-xl"
                  >
                    <Users size={18} className="mr-2 text-purple-400" />
                    <div>
                      <span className="font-bold text-white">
                        {userProfile.followers}
                      </span>
                      <span className="text-gray-400 ml-1 text-sm">
                        followers
                      </span>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ y: -2 }}
                    className="flex items-center bg-gray-800/50 px-4 py-2 rounded-xl"
                  >
                    <Users size={18} className="mr-2 text-blue-400" />
                    <div>
                      <span className="font-bold text-white">
                        {userProfile.following}
                      </span>
                      <span className="text-gray-400 ml-1 text-sm">
                        following
                      </span>
                    </div>
                  </motion.div>
                </div>

                {/* Social Links */}
                <div className="flex gap-2 ml-auto">
                  <motion.a
                    whileHover={{ y: -2, scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    href={`https://twitter.com/${userProfile.socialLinks.twitter}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 bg-gray-800/80 hover:bg-blue-700 rounded-full transition-colors duration-300"
                  >
                    <Twitter size={16} className="text-white" />
                  </motion.a>
                  <motion.a
                    whileHover={{ y: -2, scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    href={`https://instagram.com/${userProfile.socialLinks.instagram}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 bg-gray-800/80 hover:bg-pink-600 rounded-full transition-colors duration-300"
                  >
                    <Instagram size={16} className="text-white" />
                  </motion.a>
                  <motion.a
                    whileHover={{ y: -2, scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    href={`https://${userProfile.socialLinks.website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 bg-gray-800/80 hover:bg-indigo-600 rounded-full transition-colors duration-300"
                  >
                    <Globe size={16} className="text-white" />
                  </motion.a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Creator Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-900 rounded-xl shadow-2xl p-6 max-w-md w-full border border-gray-800"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">
                Request Creator Status
              </h3>
              <button
                onClick={() => setShowRequestModal(false)}
                className="p-1 rounded-full hover:bg-gray-800"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <p className="text-gray-300 mb-4">
              Tell us why you would like to become a creator on our platform.
              This will help our team review your request.
            </p>
            <textarea
              value={requestMessage}
              onChange={(e) => setRequestMessage(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white mb-4 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
              rows={4}
              placeholder="I want to become a creator because..."
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowRequestModal(false)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={submitCreatorRequest}
                disabled={isSubmitting || !requestMessage.trim()}
                className={`px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg transition flex items-center ${
                  isSubmitting || !requestMessage.trim()
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default UserProfileHeader;
