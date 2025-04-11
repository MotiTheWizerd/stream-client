import { useState, useEffect, useCallback } from "react";
import { useAppSelector } from "@/lib/redux/hooks";
import toast from "react-hot-toast";
import { ProfileData } from "@/app/types/profile"; // Import shared type

export function useFollowUser(
  initialIsFollowing: boolean | undefined,
  profileData: ProfileData | null,
  setProfileData: React.Dispatch<React.SetStateAction<ProfileData | null>>
) {
  const [isFollowingStatus, setIsFollowingStatus] = useState(
    initialIsFollowing ?? false
  );
  const { user: currentUser, token } = useAppSelector((state) => state.user);
  const apiBaseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "";

  // Update internal state if initial prop changes (e.g., profile data reloads)
  useEffect(() => {
    setIsFollowingStatus(initialIsFollowing ?? false);
  }, [initialIsFollowing]);

  const handleFollowUser = useCallback(
    async (targetUserId: string) => {
      if (!currentUser?.id || !token) {
        toast.error("Please log in to follow users.");
        console.warn(
          "Follow attempt failed: User not logged in or token missing."
        );
        return;
      }

      if (isFollowingStatus) {
        console.log("Already following user:", targetUserId);
        return; // Avoid redundant calls
      }

      console.log("Attempting to follow user:", targetUserId);
      try {
        if (!apiBaseUrl) {
          toast.error("API Error: Could not follow user.");
          throw new Error("API Base URL not configured for following user");
        }
        const response = await fetch(`${apiBaseUrl}/api/users/follow`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userIdToFollow: targetUserId,
          }),
        });

        const responseData = await response.json().catch(() => ({
          error: `Server returned non-JSON response with status ${response.status}`,
        }));

        if (!response.ok) {
          console.error(
            "Server response on follow:",
            response.status,
            responseData
          );
          toast.error(responseData?.message || "Failed to follow user.");
          throw new Error(
            responseData?.error ||
              `Follow request failed. Status: ${response.status}`
          );
        }

        console.log("Follow success:", responseData);
        toast.success("User followed!");
        setIsFollowingStatus(true);

        // Optimistically update follower count in the UI
        setProfileData((prevData) => {
          if (!prevData) return null;
          return {
            ...prevData,
            isFollowing: true, // Ensure this is updated too
            followerCount: (prevData.followerCount || 0) + 1,
          };
        });
      } catch (error) {
        console.error("Error in handleFollowUser:", error);
        // Potentially revert UI changes if needed, though toast provides feedback
      }
    },
    [currentUser, token, apiBaseUrl, setProfileData, isFollowingStatus] // Add isFollowingStatus dependency
  );

  const handleUnfollowUser = useCallback(
    async (targetUserId: string) => {
      if (!currentUser?.id || !token) {
        toast.error("Please log in to unfollow users.");
        console.warn(
          "Unfollow attempt failed: User not logged in or token missing."
        );
        return;
      }

      if (!isFollowingStatus) {
        console.log("Not following user:", targetUserId);
        return; // Avoid redundant calls
      }

      console.log("Attempting to unfollow user:", targetUserId);
      try {
        if (!apiBaseUrl) {
          toast.error("API Error: Could not unfollow user.");
          throw new Error("API Base URL not configured for unfollowing user");
        }
        const response = await fetch(`${apiBaseUrl}/api/users/unfollow`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userIdToUnfollow: targetUserId,
          }),
        });

        const responseData = await response.json().catch(() => ({
          error: `Server returned non-JSON response with status ${response.status}`,
        }));

        if (!response.ok) {
          console.error(
            "Server response on unfollow:",
            response.status,
            responseData
          );
          toast.error(responseData?.message || "Failed to unfollow user.");
          throw new Error(
            responseData?.error ||
              `Unfollow request failed. Status: ${response.status}`
          );
        }

        console.log("Unfollow success:", responseData);
        toast.success("User unfollowed.");
        setIsFollowingStatus(false);

        // Optimistically update follower count in the UI
        setProfileData((prevData) => {
          if (!prevData) return null;
          return {
            ...prevData,
            isFollowing: false, // Ensure this is updated too
            followerCount: Math.max(0, (prevData.followerCount || 0) - 1),
          };
        });
      } catch (error) {
        console.error("Error in handleUnfollowUser:", error);
        // Potentially revert UI changes if needed
      }
    },
    [currentUser, token, apiBaseUrl, setProfileData, isFollowingStatus] // Add isFollowingStatus dependency
  );

  return { isFollowingStatus, handleFollowUser, handleUnfollowUser };
}
