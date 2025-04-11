"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { UserCircle, PencilIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { getAvatar } from "@/lib/utils/userUtils";
import { motion } from "framer-motion";

// Create a separate User interface that can be exported and reused
export interface User {
  id?: string;
  username?: string;
  avatarUrl?: string;
  coins?: number;
  isOnline?: boolean;
  // Add other user properties as needed
}

interface UserAvatarProps {
  user?: User | null;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  showUsername?: boolean;
  showStatus?: boolean;
  textPosition?: "below" | "right";
  textColor?: string;
  textWeight?: "normal" | "medium" | "semibold" | "bold";
  className?: string;
  onClick?: () => void;
  isCurrentUser?: boolean;
  onEditAvatar?: () => void;
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  user,
  size = "md",
  showUsername = false,
  showStatus = false,
  textPosition = "below",
  textColor = "text-gray-200",
  textWeight = "medium",
  className = "",
  onClick,
  isCurrentUser = false,
  onEditAvatar,
}) => {
  const router = useRouter();
  const [imgError, setImgError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Log avatarUrl changes to verify prop updates
  useEffect(() => {}, [user?.avatarUrl]);

  // Size mapping
  const sizeClasses = {
    xs: "w-7 h-7",
    sm: "w-9 h-9",
    md: "w-11 h-11",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  };

  // Edit icon size mapping
  const editIconSizeClasses = {
    xs: "w-4 h-4",
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-10 h-10",
  };

  const statusSizeClasses = {
    xs: "w-2 h-2",
    sm: "w-2.5 h-2.5",
    md: "w-3 h-3",
    lg: "w-4 h-4",
    xl: "w-3 h-3", // Reduced size for xl avatar
  };

  const textSizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-sm",
    lg: "text-base",
    xl: "text-lg",
  };

  const weightClasses = {
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
  };

  const avatarSize = sizeClasses[size];
  const editIconSize = editIconSizeClasses[size];
  const statusSize = statusSizeClasses[size];
  const textSize = textSizeClasses[size];
  const fontWeight = weightClasses[textWeight];

  // Fallback values if user is not provided
  const userId = user?.id;
  const username = user?.username || "User";
  // Get avatar URL using our utility function
  const providedAvatarUrl = user?.avatarUrl;
  // Only use the user's specific avatar URL if provided
  const avatarUrl = userId ? getAvatar(userId) : undefined;
  const isOnline = user?.isOnline || false;

  // Handle image load error
  const handleImgError = () => {
    setImgError(true);
  };

  // Base container class - flex direction based on text position, ignoring any override from className
  const containerDirectionClass =
    textPosition === "below"
      ? "flex-col items-center"
      : "flex-row items-center";

  // Create container class without overriding the flex direction
  const containerClass =
    `flex ${containerDirectionClass} gap-2.5 transition-all hover:opacity-95 ${className}`.replace(
      /flex-(row|col)\s+/g,
      ""
    );

  const handleNavigation = () => {
    if (onClick) {
      onClick();
    } else if (userId) {
      // Ensure we scroll to top before navigating
      window.scrollTo(0, 0);
      router.push(`/user-profile/${userId}`);
    } else {
      router.push("/auth");
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent avatar click event
    if (onEditAvatar) {
      onEditAvatar();
    }
  };

  const avatarContent = (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div>
        <div
          className={`${avatarSize} relative border-2 border-white/20 bg-gradient-to-br from-purple-500/10 to-blue-500/10 shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 flex items-center justify-center rounded-full overflow-hidden`}
        >
          <motion.div
            className="absolute -bottom-1 -right-10 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white dark:border-gray-800"
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
              repeatType: "reverse",
            }}
          ></motion.div>
          {avatarUrl && !imgError ? (
            <Image
              src={avatarUrl}
              alt={username}
              fill
              className="object-cover"
              sizes={`(max-width: 768px) 100vw, 50vw`}
              onError={handleImgError}
              priority={true}
              key={avatarUrl || `avatar-default-${userId}`}
            />
          ) : (
            <div
              className={`absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-500 ${avatarSize} flex items-center justify-center`}
              style={
                userId
                  ? {
                      background: `linear-gradient(135deg, hsl(${
                        parseInt(userId.slice(0, 8), 16) % 360
                      }, 80%, 50%), hsl(${
                        parseInt(userId.slice(8, 16), 16) % 360
                      }, 80%, 50%)`,
                    }
                  : undefined
              }
            >
              <UserCircle
                className={`${avatarSize} text-white/90 drop-shadow-md`}
                strokeWidth={1.5}
              />
            </div>
          )}
        </div>
      </div>

      {/* Edit Icon Overlay - Only shown when it's the current user's avatar and being hovered */}
      {isCurrentUser && isHovered && (
        <div
          className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center cursor-pointer transition-opacity duration-200"
          onClick={handleEditClick}
        >
          <PencilIcon className={`${editIconSize} text-white`} />
        </div>
      )}

      {showStatus && (
        <div className="absolute bottom-0 right-2 transform translate-x-[15%] translate-y-[15%]">
          <div className="relative">
            <div
              className={`${statusSize} bg-green-400 rounded-full shadow-sm`}
            ></div>
            <div
              className={`absolute inset-0 ${statusSize} bg-green-400 rounded-full opacity-60`}
              style={{
                animation: "ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite", // Reverted to original duration
              }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );

  const usernameContent = showUsername && (
    <div className="w-full" onClick={handleNavigation}>
      <span
        className={`${textColor} ${fontWeight} ${textSize} truncate ${
          textPosition === "below" ? "text-left !important" : ""
        } max-w-[150px] inline-block`}
      >
        {username}
      </span>
    </div>
  );

  return (
    <button
      onClick={handleNavigation}
      className={`${containerClass} cursor-pointer w-auto text-left`}
      style={{
        appearance: "none",
        background: "none",
        border: "none",
        padding: 0,
      }}
    >
      {avatarContent}
      {usernameContent}
    </button>
  );
};

export default UserAvatar;
