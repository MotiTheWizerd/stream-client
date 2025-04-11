import { useState, useEffect } from "react";
import { useAppSelector } from "@/lib/redux/hooks";
import { ProfileData } from "@/app/types/profile"; // Import shared type

// Remove local ProfileData interface definition
// interface ProfileData { ... }

export function useUserProfile(userId: string) {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAppSelector((state) => state.user);
  const apiBaseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "";

  useEffect(() => {
    let isMounted = true; // Prevent state update on unmounted component
    const fetchUserProfile = async () => {
      setLoading(true);
      setError(null);
      setProfileData(null); // Reset profile data on new fetch

      // No token means we can still fetch public profiles, but isFollowing might be incorrect
      // We handle token presence for the Authorization header specifically.
      if (!userId) {
        console.warn("fetchUserProfile: No userId provided.");
        setLoading(false);
        return;
      }

      try {
        const headers: HeadersInit = { "Content-Type": "application/json" };
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        if (!apiBaseUrl) {
          throw new Error("API Base URL not configured for fetching profile");
        }
        const response = await fetch(`${apiBaseUrl}/api/users/${userId}`, {
          headers,
        });

        if (!isMounted) return; // Don't update state if component unmounted

        if (!response.ok) {
          if (response.status === 404) {
            console.warn("User profile not found:", userId);
            setError("User profile not found.");
            setProfileData(null);
          } else {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage =
              errorData?.message ||
              `Failed to fetch user profile. Status: ${response.status}`;
            throw new Error(errorMessage);
          }
        } else {
          const data: ProfileData = await response.json();
          setProfileData(data);
        }
      } catch (error: any) {
        console.error("Error fetching profile:", error);
        if (isMounted) {
          setError(error.message || "An unexpected error occurred.");
          setProfileData(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchUserProfile();

    return () => {
      isMounted = false; // Cleanup function to set isMounted to false
    };
  }, [userId, token, apiBaseUrl]); // Rerun effect if userId, token, or baseUrl changes

  return { profileData, setProfileData, loading, error };
}
