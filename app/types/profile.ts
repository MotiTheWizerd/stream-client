// Define shared interface for User Profile Data
export interface ProfileData {
    id: string;
    username: string;
    isOnline: boolean;
    bio?: string;
    avatar?: string;
    banner?: string;
    isFollowing?: boolean;
    isCreator?: boolean;
    followerCount?: number;
    followingCount?: number;
} 