"use client";
import React, { useState, useRef, ChangeEvent, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import {
  Image as ImageIcon,
  Video as VideoIcon,
  Smile,
  XCircle,
  Paperclip,
  Loader2,
  Link as LinkIcon,
} from "lucide-react";
import Image from "next/image"; // Import next/image
import toast from "react-hot-toast";

// --- Local Type Definitions ---
interface BaseMediaItem {
  source: "upload" | "link";
  title: string;
}

export interface UploadMediaItem extends BaseMediaItem {
  source: "upload";
  file: File;
  type: "image" | "video";
  previewUrl: string;
}

export interface LinkMediaItem extends BaseMediaItem {
  source: "link";
  url: string;
  type: "image" | "video" | "link" | "loading"; // Add 'loading' state
  previewUrl: string | null;
}

export type MediaItem = UploadMediaItem | LinkMediaItem;
// --- End Local Type Definitions ---

// Define localStorage key
const DRAFT_STORAGE_KEY = "newUserPostDraft";

interface NewUserPostProps {
  onClose: () => void;
  token: string | null; // Pass token for potential future API calls
  // Add a callback for successful post (optional, for refreshing feed etc.)
  onPostSuccess?: () => void;
}

// --- START: Extracted PostSettings Component ---
interface PostSettingsProps {
  visibility: "public" | "subscribers";
  setVisibility: (value: "public" | "subscribers") => void;
  allowComments: boolean;
  setAllowComments: (value: boolean) => void;
}

const PostSettings: React.FC<PostSettingsProps> = ({
  visibility,
  setVisibility,
  allowComments,
  setAllowComments,
}) => {
  return (
    <div className="w-1/5 p-4 border-r border-gray-700">
      <h3 className="text-lg font-semibold mb-3 text-gray-200">Settings</h3>
      {/* Post Visibility Selector */}
      <div className="mb-2">
        <label
          htmlFor="visibility"
          className="block text-sm font-medium text-gray-400 mb-1"
        >
          Who can see this post?
        </label>
        <select
          id="visibility"
          value={visibility}
          onChange={(e) =>
            setVisibility(e.target.value as "public" | "subscribers")
          }
          className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="public">Public</option>
          <option value="subscribers">Subscribers Only</option>
        </select>
      </div>
      {/* Allow Comments Checkbox */}
      <div className="mb-4 flex items-center">
        <input
          id="allowComments"
          type="checkbox"
          checked={allowComments}
          onChange={(e) => setAllowComments(e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-500 rounded bg-gray-700 cursor-pointer"
        />
        <label
          htmlFor="allowComments"
          className="ml-2 block text-sm text-gray-300 cursor-pointer"
        >
          Allow Comments
        </label>
      </div>
      <p className="text-sm text-gray-400">
        {/* Placeholder for future settings */}
        Tags, etc.
      </p>
      {/* Add more settings controls here later */}
    </div>
  );
};
// --- END: Extracted PostSettings Component ---

// --- START: Extracted MediaPreviewItem Component ---
interface MediaPreviewItemProps {
  item: MediaItem;
  index: number;
  onRemove: (index: number) => void;
  onTitleChange: (index: number, title: string) => void;
  onPreviewError: (index: number) => void; // For handling link preview errors
}

const MediaPreviewItem: React.FC<MediaPreviewItemProps> = ({
  item,
  index,
  onRemove,
  onTitleChange,
  onPreviewError,
}) => {
  return (
    <div
      key={index} // Key is still needed when mapping in parent, but good practice here too
      className="relative group bg-gray-800 p-3 rounded-lg border border-gray-700"
    >
      <button
        onClick={() => onRemove(index)}
        className="absolute -top-2 -right-2 p-1 bg-gray-600 rounded-full text-white hover:bg-red-500 z-10 transition-colors"
        aria-label="Remove media"
      >
        <XCircle size={18} />
      </button>

      {/* Preview based on source */}
      {item.source === "upload" && (
        <div className="flex items-center space-x-3">
          {item.type === "image" ? (
            <Image
              src={item.previewUrl}
              alt={`Preview ${index}`}
              width={80} // Specify width
              height={80} // Specify height
              className="object-cover rounded w-20 h-20" // Use classes for sizing
            />
          ) : (
            <video
              src={item.previewUrl}
              controls // Add controls for video preview
              className="w-20 h-20 object-cover rounded" // Adjust size as needed
            />
          )}
          <span className="text-sm text-gray-400 truncate flex-1">
            {item.file.name}
          </span>
        </div>
      )}

      {/* Additional content for the rest of the component */}
      {/* ... */}
    </div>
  );
};
// --- END: Extracted MediaPreviewItem Component ---

// Main component implementation
const NewUserPost: React.FC<NewUserPostProps> = ({
  onClose,
  token,
  onPostSuccess,
}) => {
  const [postText, setPostText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem[]>([]);
  // Other state variables and implementation...

  const handleSubmit = async () => {
    // Implementation of post submission
    // ...
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center">
      {/* Component UI */}
      <div className="bg-gray-800 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Content */}
        {/* ... */}
      </div>
    </div>
  );
};

export default NewUserPost;
