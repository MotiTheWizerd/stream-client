// Type definitions for post-related components
import { ReactionType } from "../components/ReactionSelector";

// Author interface
export interface Author {
  id: string;
  username: string;
  avatar?: string | null;
}

// Media item interface
export interface MediaItem {
  source: "link" | "upload";
  media: string;
  type: "image" | "video" | "unknown" | "link";
  title?: string | null;
  mediaId?: string;
  userMediaReaction?: ReactionType | null;
  mediaReactionCounts?: Record<ReactionType, number>;
}

// Post interface
export interface Post {
  id: string;
  content: string;
  createdAt: string;
  author: Author;
  mediaUrls: MediaItem[]; // Keep old one temporarily if needed elsewhere, but ideally remove
  mediaItems: ClientPostMediaItem[]; // Use the new interface
  visibility: "PUBLIC" | "SUBSCRIBERS";
  allowComments: boolean;
  authorId: string;
  comments?: Comment[];
  userReaction?: ReactionType | null;
  reactionCounts: Record<ReactionType, number>;
  canInteract: boolean;
  commentCount: number;
}

// New interface matching the Prisma PostMediaItem model structure
export interface ClientPostMediaItem {
  id: string;
  url: string; // URL (relative path for uploads, full URL for links)
  type: string; // e.g., 'image', 'video', 'link', 'unknown'
  title?: string | null; // Optional title provided by user
  source: string; // e.g., 'upload', 'link'
  createdAt: string; // Assuming ISO string format from server
  updatedAt: string; // Assuming ISO string format from server
  postId: string;
  // Add fields for reaction data
  userReaction?: ReactionType | null;
  reactionCounts?: Record<ReactionType, number>;
}

// Comment interface
export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: Author;
  postId: string;
}

// Props for UsersPosts component
export interface UsersPostsProps {
  currentUserId: string | null;
  authToken: string | null;
  posts: Post[];
  onReactionUpdate?: (
    postId: string,
    newReactionCounts: Record<ReactionType, number>,
    newUserReaction: ReactionType | null
  ) => void;
}

// Animation variants
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export const postVariants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 300,
    },
  },
  hover: {
    y: -5,
    boxShadow:
      "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 400,
    },
  },
};
