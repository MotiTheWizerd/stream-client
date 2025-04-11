/**
 * Gets the avatar URL for a user based on their ID
 *
 * This function determines the path to a user's avatar in the
 * public/users/images/[user_id]/user_avatar directory.
 *
 * @param userId - The user ID
 * @returns The URL to the user's avatar image, or undefined if no user ID provided
 */
export const getAvatar = (userId?: string): string | undefined => {
  if (!userId) return undefined;

  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "";
  // Only use jpeg extension
  return `${serverUrl}/users/images/${userId}/user_avatar.jpeg`;
};

/**
 * Safely gets a user's avatar URL
 *
 * Similar to getAvatar but this returns a placeholder image if no avatar is found
 *
 * @param userId - The user ID
 * @param fallbackUrl - Optional custom fallback URL if no avatar is found
 * @returns The URL to use for the user's avatar image
 */
export const getUserAvatarUrl = (
  userId?: string,
  fallbackUrl: string = "/profile-avatar.jpg"
): string => {
  const avatarUrl = getAvatar(userId);
  return avatarUrl || fallbackUrl;
};
