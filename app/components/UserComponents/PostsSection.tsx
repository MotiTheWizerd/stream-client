import React from "react";
import UsersPosts, { Post } from "@/components/posts/UsersPosts";
import { ReactionType } from "@/components/ReactionSelector";
import {
  LoadingSpinner,
  ErrorMessage,
  EmptyPostsState,
} from "@/app/components/common/StateIndicators"; // Corrected path

interface PostsSectionProps {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
  currentUserId: string | null;
  authToken: string | null; // Auth token might be null
  onReactionUpdate: (
    postId: string,
    newReactionCounts: Record<ReactionType, number>,
    newUserReaction: ReactionType | null
  ) => void;
}

const PostsSection = ({
  posts,
  isLoading,
  error,
  currentUserId,
  authToken,
  onReactionUpdate,
}: PostsSectionProps) => {
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} title="Error Loading Posts" />;
  }

  if (posts.length === 0) {
    return <EmptyPostsState />;
  }

  return (
    <div className="mt-6">
      <UsersPosts
        currentUserId={currentUserId}
        authToken={authToken}
        posts={posts}
        onReactionUpdate={onReactionUpdate}
      />
    </div>
  );
};

export default PostsSection;
