import React from "react";
import { Button } from "@/components/ui/button"; // Assuming Button component exists

interface FollowButtonProps {
  userId: string;
  isFollowing: boolean;
  onFollow: (userId: string) => Promise<void>; // Match hook return type
  onUnfollow: (userId: string) => Promise<void>; // Match hook return type
  isOwnProfile: boolean;
  isLoading?: boolean; // Optional loading state
}

const FollowButton = ({
  userId,
  isFollowing,
  onFollow,
  onUnfollow,
  isOwnProfile,
  isLoading,
}: FollowButtonProps) => {
  if (isOwnProfile) {
    return null; // Don't show follow button on own profile
  }

  const handleClick = () => {
    if (isLoading) return; // Prevent multiple clicks while loading
    if (isFollowing) {
      onUnfollow(userId);
    } else {
      onFollow(userId);
    }
  };

  return (
    <Button
      variant={isFollowing ? "secondary" : "default"} // Style based on state
      onClick={handleClick}
      disabled={isLoading}
      className="w-full sm:w-auto px-6 py-2 text-sm font-medium rounded-md transition-colors duration-200 ease-in-out disabled:opacity-50"
    >
      {isLoading ? "Processing..." : isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
};

export default FollowButton; 