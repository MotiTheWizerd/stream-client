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
// import { MediaItem, UploadMediaItem, LinkMediaItem } from "./UsersPosts"; // Removed incorrect import

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
      {item.source === "link" && (
        <div className="flex items-center space-x-3 min-h-[80px]">
          {" "}
          {/* Ensure min height */}
          {item.type === "loading" && (
            <div className="flex items-center justify-center w-20 h-20 bg-gray-700 rounded flex-shrink-0">
              <Loader2 size={24} className="text-gray-400 animate-spin" />
            </div>
          )}
          {item.type === "image" && item.previewUrl && (
            <Image
              src={item.previewUrl}
              alt={`Preview ${index}`}
              width={80}
              height={80}
              className="object-cover rounded w-20 h-20 flex-shrink-0"
              onError={() => {
                console.warn(
                  `Failed to load preview for linked image: ${item.url}`
                );
                onPreviewError(index); // Use the prop handler
              }}
            />
          )}
          {item.type === "video" && item.previewUrl && (
            <video
              src={item.previewUrl}
              controls
              preload="metadata" // Request metadata for duration/thumbnail
              className="object-cover rounded w-20 h-20 flex-shrink-0 bg-gray-700" // Added bg color
              onError={() => {
                console.warn(
                  `Failed to load preview for linked video: ${item.url}`
                );
                onPreviewError(index); // Use the prop handler
              }}
            />
          )}
          {(item.type === "link" ||
            (!item.previewUrl && item.type !== "loading")) && ( // Fallback for failed previews or generic links
            <div className="flex items-center justify-center w-20 h-20 bg-gray-700 rounded flex-shrink-0">
              <LinkIcon size={32} className="text-blue-400" />
            </div>
          )}
          {/* Display URL or a placeholder while loading */}
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-400 hover:underline truncate flex-1 break-all"
          >
            {item.type === "loading" ? "Validating link..." : item.url}
          </a>
        </div>
      )}

      {/* Title Input for both uploads and links */}
      <input
        type="text"
        placeholder="Optional: Add title..."
        value={item.title}
        onChange={(e) => onTitleChange(index, e.target.value)}
        maxLength={100} // Example max length
        className="mt-2 w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
    </div>
  );
};
// --- END: Extracted MediaPreviewItem Component ---

// --- START: Extracted MediaInput Component (using forwardRef) ---
interface MediaInputProps {
  selectedMediaLength: number;
  MAX_MEDIA_ITEMS: number;
  isSubmitting: boolean;
  onMediaIconClick: () => void;
  handleFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  fileError: string | null;
  linkUrl: string;
  setLinkUrl: (value: string) => void;
  linkError: string | null;
  handleAddLink: () => void;
}

// Wrap component definition with React.forwardRef
const MediaInput = React.forwardRef<HTMLInputElement, MediaInputProps>(
  (
    {
      selectedMediaLength,
      MAX_MEDIA_ITEMS,
      isSubmitting,
      onMediaIconClick,
      handleFileChange,
      fileError,
      linkUrl,
      setLinkUrl,
      linkError,
      handleAddLink,
    },
    ref // Receive ref as the second argument
  ) => {
    // NOTE: The calculation for uploadCount/linkCount might need adjustment
    //       based on the specific filtering logic used originally if the
    //       display differs from the expected output.
    const uploadCount = 0; // Placeholder - needs accurate calculation if counts per type are displayed
    const linkCount = 0; // Placeholder
    const availableSlots = MAX_MEDIA_ITEMS - selectedMediaLength;

    return (
      <div className="mt-4 pt-4 border-t border-gray-700">
        {/* File Upload */}
        <div className="flex items-center space-x-2 mb-3">
          <button
            onClick={onMediaIconClick}
            disabled={isSubmitting || selectedMediaLength >= MAX_MEDIA_ITEMS}
            className="p-2 text-gray-400 hover:text-blue-400 rounded-full hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Upload Image/Video"
          >
            <Paperclip size={20} />
          </button>
          <span className="text-sm text-gray-500">
            {/* Simplified count display, adjust if type-specific counts needed */}
            Upload image or video (Max {MAX_MEDIA_ITEMS} total)
          </span>
        </div>
        {/* Hidden combined input - Attach the forwarded ref here */}
        <input
          type="file"
          ref={ref} // Use the forwarded ref
          onChange={handleFileChange}
          accept="image/*,video/*"
          multiple
          className="hidden"
          disabled={isSubmitting || selectedMediaLength >= MAX_MEDIA_ITEMS}
        />
        {fileError && (
          <p className="text-red-500 text-xs mt-1 mb-2">{fileError}</p>
        )}

        {/* Link Adding */}
        <div className="flex items-center space-x-2">
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="Paste media URL (e.g., YouTube, image link)"
            disabled={isSubmitting || selectedMediaLength >= MAX_MEDIA_ITEMS}
            className="flex-grow bg-gray-700 border border-gray-600 rounded-md px-3 py-1.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            onClick={handleAddLink}
            disabled={
              isSubmitting ||
              selectedMediaLength >= MAX_MEDIA_ITEMS ||
              !linkUrl.trim()
            }
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-md text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Add Link"
          >
            Add Link
          </button>
        </div>
        {linkError && (
          <p className="text-red-500 text-xs mt-1 mb-2">{linkError}</p>
        )}

        <p className="text-xs text-gray-500 mt-2">
          Total media items: {selectedMediaLength}/{MAX_MEDIA_ITEMS}
        </p>
      </div>
    );
  }
);
// Add display name for better debugging
MediaInput.displayName = "MediaInput";

// --- END: Extracted MediaInput Component ---

// --- START: Extracted PostActions Component ---
interface PostActionsProps {
  isSubmitting: boolean;
  postText: string;
  selectedMediaLength: number;
  onCancel: () => void;
  onSubmit: () => void;
}

const PostActions: React.FC<PostActionsProps> = ({
  isSubmitting,
  postText,
  selectedMediaLength,
  onCancel,
  onSubmit,
}) => {
  const canSubmit =
    !isSubmitting && (postText.trim() !== "" || selectedMediaLength > 0);

  return (
    <div className="mt-6 flex justify-end space-x-3">
      <button
        onClick={onCancel}
        disabled={isSubmitting} // Disable cancel while submitting
        className="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Cancel
      </button>
      <button
        onClick={onSubmit}
        disabled={!canSubmit}
        className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
      >
        {isSubmitting ? (
          <>
            <Loader2 size={20} className="animate-spin mr-2" />
            Posting...
          </>
        ) : (
          "Post"
        )}
      </button>
    </div>
  );
};
// --- END: Extracted PostActions Component ---

const MAX_MEDIA_ITEMS = 20; // Define max items constant

const NewUserPost = ({ onClose, token, onPostSuccess }: NewUserPostProps) => {
  const [postText, setPostText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state for submission
  const [submitError, setSubmitError] = useState<string | null>(null); // Error state for submission
  const [visibility, setVisibility] = useState<"public" | "subscribers">(
    "public"
  );
  const [allowComments, setAllowComments] = useState<boolean>(true);
  const [linkUrl, setLinkUrl] = useState(""); // State for URL input
  const [linkError, setLinkError] = useState<string | null>(null); // State for link input error

  // Refs for hidden file inputs - Combine into one
  const mediaInputRef = useRef<HTMLInputElement | null>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null); // Ref for the emoji picker div
  const emojiButtonRef = useRef<HTMLButtonElement>(null); // Ref for the emoji button

  const apiBaseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "";

  // --- Draft Saving Logic ---
  // Load draft from local storage on initial mount
  useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (savedDraft) {
      setPostText(savedDraft);
    }
  }, []);

  // Save draft to local storage whenever postText changes
  useEffect(() => {
    // Simple debounce: save only if user hasn't typed for 500ms
    // Or just save directly for simplicity for now
    if (postText) {
      localStorage.setItem(DRAFT_STORAGE_KEY, postText);
    } else {
      // Clear storage if text is empty
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    }
  }, [postText]);

  // --- End Draft Saving Logic ---

  const handleCloseInternal = () => {
    setPostText("");
    setShowEmojiPicker(false);
    setSelectedMedia([]); // Clear media array
    setFileError(null);
    setLinkUrl(""); // Clear link input
    setLinkError(null); // Clear link error
    if (mediaInputRef.current) mediaInputRef.current.value = "";
    localStorage.removeItem(DRAFT_STORAGE_KEY); // Clear draft on close
    onClose();
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setPostText((prevInput) => prevInput + emojiData.emoji);
    setShowEmojiPicker(false); // Fix: Use setShowEmojiPicker
  };

  // --- Media Handling ---

  // Handler for link preview errors (to be passed to MediaPreviewItem)
  const handlePreviewError = (indexToUpdate: number) => {
    setSelectedMedia((prev) =>
      prev.map((media, i) =>
        i === indexToUpdate && media.source === "link"
          ? { ...media, type: "link", previewUrl: null } // Fallback to generic link
          : media
      )
    );
  };

  // Function to validate link and update preview
  const validateAndPreviewLink = (url: string, itemIndex: number) => {
    // Try Image validation first
    const img = document.createElement("img");
    img.onload = () => {
      // It's an image
      setSelectedMedia((prev) =>
        prev.map((item, index) =>
          index === itemIndex && item.source === "link"
            ? { ...item, type: "image", previewUrl: url }
            : item
        )
      );
    };
    img.onerror = () => {
      // Not an image, try Video
      const video = document.createElement("video");
      video.onloadedmetadata = () => {
        // Use onloadedmetadata for better video detection
        // It's a video
        setSelectedMedia((prev) =>
          prev.map((item, index) =>
            index === itemIndex && item.source === "link"
              ? { ...item, type: "video", previewUrl: url }
              : item
          )
        );
      };
      video.onerror = () => {
        // Not image or video, fallback to generic link
        setSelectedMedia((prev) =>
          prev.map((item, index) =>
            index === itemIndex && item.source === "link"
              ? { ...item, type: "link", previewUrl: null } // Set type to 'link'
              : item
          )
        );
      };
      video.src = url;
    };
    img.src = url;
  };

  // Function to add a Link Media Item
  const handleAddLink = () => {
    setLinkError(null); // Clear previous link errors
    setFileError(null); // Clear file errors too

    if (selectedMedia.length >= MAX_MEDIA_ITEMS) {
      setLinkError(
        `You can only attach up to ${MAX_MEDIA_ITEMS} media items (files or links).`
      );
      return;
    }

    if (!linkUrl.trim()) {
      setLinkError("Please enter a URL.");
      return;
    }

    // Basic URL validation (starts with http/https) - enhance as needed
    if (!/^https?:\/\//.test(linkUrl)) {
      setLinkError(
        "Please enter a valid URL (starting with http:// or https://)."
      );
      return;
    }

    const newItemIndex = selectedMedia.length;
    const newLinkItem: LinkMediaItem = {
      source: "link",
      url: linkUrl.trim(),
      type: "loading", // Start as loading
      previewUrl: null, // Initially no preview
      title: "", // Initialize title for links as well
    };

    // Add placeholder immediately
    setSelectedMedia((prev) => [...prev, newLinkItem]);
    // Start validation
    validateAndPreviewLink(linkUrl.trim(), newItemIndex);

    setLinkUrl(""); // Clear the input field
  };

  // Generic function to handle file selection (image or video)
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFileError(null); // Clear previous file errors
    setLinkError(null); // Clear link errors too
    const files = event.target.files;
    const currentFileCount = selectedMedia.length;
    const availableSlots = MAX_MEDIA_ITEMS - currentFileCount;

    if (!files || files.length === 0) {
      return; // No files selected
    }

    if (files.length > availableSlots) {
      setFileError(
        `You can only select up to ${availableSlots} more file(s). You already have ${currentFileCount} item(s) attached.`
      );
      event.target.value = ""; // Clear the input
      return;
    }

    const newFilesPromises = Array.from(files).map((file) => {
      return new Promise<UploadMediaItem | null>((resolve) => {
        // Changed type here
        let fileType: "image" | "video" | null = null;
        if (file.type.startsWith("image/")) {
          fileType = "image";
        } else if (file.type.startsWith("video/")) {
          fileType = "video";
        } else {
          console.warn(
            `[handleFileChange] Skipping unsupported file type: ${file.name} (${file.type})`
          );
          resolve(null);
          return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({
            source: "upload", // Add source field
            file,
            type: fileType as "image" | "video",
            previewUrl: reader.result as string,
            title: "", // Initialize with empty title
          });
        };
        reader.onerror = () => {
          console.error("Error reading file:", file.name);
          resolve(null); // Resolve with null on error
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(newFilesPromises).then((results) => {
      // Log all results before filtering
      console.log("[handleFileChange] Processing results:", results);

      const validNewMedia = results.filter(
        (item): item is UploadMediaItem => item !== null // Use type predicate and explicitly cast
      ) as UploadMediaItem[]; // Filter nulls and cast

      // Log valid items
      console.log("[handleFileChange] Valid new media items:", validNewMedia);

      if (validNewMedia.length > 0) {
        setSelectedMedia((prev) => [...prev, ...validNewMedia]);
      }
      // Clear the file input value so the user can select the same file again if needed
      if (event.target) {
        event.target.value = "";
      }
      // Log the comparison that triggers the error message
      console.log(
        `[handleFileChange] Comparison: validNewMedia.length (${validNewMedia.length}) vs files.length (${files.length})`
      );
      if (validNewMedia.length !== files.length) {
        setFileError(
          "Some selected files were not supported and were skipped."
        );
      }
    });
  };

  // Function to remove a media item (works for both uploads and links)
  const handleRemoveMedia = (indexToRemove: number) => {
    setSelectedMedia((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
    // Also clear related errors if we remove an item
    setFileError(null);
    setLinkError(null);
  };

  // Function to update the title of a media item
  const handleTitleChange = (indexToUpdate: number, newTitle: string) => {
    setSelectedMedia((prev) =>
      prev.map((item, index) =>
        index === indexToUpdate ? { ...item, title: newTitle } : item
      )
    );
  };

  // --- End Media Handling ---

  const handlePostSubmit = async () => {
    if ((!postText.trim() && selectedMedia.length === 0) || isSubmitting) {
      return; // Don't submit if empty or already submitting
    }
    if (!token) {
      setSubmitError("You must be logged in to post.");
      toast.error("You must be logged in to post.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const formData = new FormData();
    formData.append("content", postText);
    formData.append("visibility", visibility);
    formData.append("allowComments", String(allowComments));

    // Separate uploaded files and linked media
    const uploadedFilesData: { index: number; file: File; title: string }[] =
      [];
    // Ensure the type sent for links is the final validated type
    const linkedMediaData: {
      url: string;
      type: "image" | "video" | "link";
      title: string;
    }[] = [];

    selectedMedia.forEach((item, index) => {
      if (item.source === "upload") {
        // Use original index for associating title later if needed, and for consistent file naming
        uploadedFilesData.push({
          index: index,
          file: item.file,
          title: item.title,
        });
        // Append file with a unique name based on its original index in the selectedMedia array
        formData.append(`media_${index}`, item.file);
      } else if (item.source === "link") {
        // Make sure type is not 'loading' before sending
        const finalType = item.type === "loading" ? "link" : item.type; // Default to 'link' if still loading (shouldn't happen ideally)
        linkedMediaData.push({
          url: item.url,
          type: finalType,
          title: item.title,
        });
      }
    });

    // Add linkedMedia as a JSON string if any exist
    if (linkedMediaData.length > 0) {
      formData.append("linkedMedia", JSON.stringify(linkedMediaData));
    }

    // Prepare titles specifically for *uploaded* files, mapping original index to title
    const uploadedFileTitles: Record<number, string> = {};
    uploadedFilesData.forEach((data) => {
      if (data.title) {
        uploadedFileTitles[data.index] = data.title;
      }
    });

    // Add uploadedFileTitles as a JSON string if needed (renamed from mediaTitles)
    // This is needed so the backend knows which title belongs to which `media_X` file
    if (Object.keys(uploadedFileTitles).length > 0) {
      formData.append("uploadedFileTitles", JSON.stringify(uploadedFileTitles));
    }

    try {
      if (!apiBaseUrl) {
        throw new Error("API Base URL not configured");
      }
      const response = await fetch(`${apiBaseUrl}/api/posts`, {
        // Use actual API endpoint
        method: "POST",
        headers: {
          // Content-Type is automatically set by browser for FormData
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message:
            "Failed to submit post. Server returned an unexpected response.",
        }));
        throw new Error(
          errorData.message ||
            `Failed to submit post. Status: ${response.status}`
        );
      }

      // Show success toast
      toast.success("Post created successfully!");

      // Scroll to top of page
      window.scrollTo({ top: 0, behavior: "smooth" });

      localStorage.removeItem(DRAFT_STORAGE_KEY); // Clear draft on successful post
      if (onPostSuccess) onPostSuccess(); // Call success callback if provided
      handleCloseInternal(); // Close form on success
    } catch (error: any) {
      console.error("Error submitting post:", error);
      const errorMessage =
        error.message || "An unexpected error occurred while posting.";
      setSubmitError(errorMessage);
      toast.error(errorMessage);
      setIsSubmitting(false); // Ensure loading state is reset on error
    }
    // The finally block is implicitly handled by resetting isSubmitting on error
    // No need to set it to false on success because handleCloseInternal does it
  };

  // Combine into one input for both images and videos
  const handleMediaIconClick = () => mediaInputRef.current?.click();

  // Close emoji picker if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showEmojiPicker &&
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node) &&
        emojiButtonRef.current &&
        !emojiButtonRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Cleanup the event listener
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]); // Rerun effect if showEmojiPicker changes

  // Character limit (optional, example: 280)
  const characterLimit = 280;
  const charactersRemaining = characterLimit - postText.length;

  return (
    <div className="bg-gray-800 rounded-lg mt-4 w-full text-white relative shadow-lg border border-gray-700 flex space-x-4">
      {/* Use the new PostSettings component */}
      <PostSettings
        visibility={visibility}
        setVisibility={setVisibility}
        allowComments={allowComments}
        setAllowComments={setAllowComments}
      />

      {/* Right Column (Main Content - 4/5 width) */}
      <div className="w-4/5 p-4 relative">
        {" "}
        {/* Added relative positioning for close button context */}
        <button
          onClick={handleCloseInternal}
          disabled={isSubmitting} // Disable cancel while submitting
          // Adjust close button positioning relative to the right column
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          aria-label="Cancel Post"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h2 className="text-xl font-semibold mb-4 text-gray-100">
          Create New Post
        </h2>
        <textarea
          className="w-full h-24 p-2 bg-transparent text-white placeholder-gray-500 focus:outline-none resize-none text-lg"
          placeholder="What's happening?"
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          maxLength={characterLimit}
          disabled={isSubmitting}
        ></textarea>
        {/* Character Count Display */}
        <div
          className={`text-sm mt-1 text-right ${
            charactersRemaining < 20
              ? charactersRemaining < 0
                ? "text-red-500"
                : "text-yellow-500"
              : "text-gray-400"
          }`}
        >
          {charactersRemaining}/{characterLimit}
        </div>
        {/* Media Previews - Use the new component */}
        <div className="mt-4 space-y-4">
          {selectedMedia.map((item, index) => (
            <MediaPreviewItem
              key={index} // Keep key here for React list rendering
              item={item}
              index={index}
              onRemove={handleRemoveMedia}
              onTitleChange={handleTitleChange}
              onPreviewError={handlePreviewError} // Pass the new handler
            />
          ))}
        </div>
        {/* Media and Link Adding Section - Use forwardRef */}
        <MediaInput
          ref={mediaInputRef} // Pass ref using the 'ref' prop
          selectedMediaLength={selectedMedia.length}
          MAX_MEDIA_ITEMS={MAX_MEDIA_ITEMS}
          isSubmitting={isSubmitting}
          onMediaIconClick={handleMediaIconClick}
          handleFileChange={handleFileChange}
          fileError={fileError}
          linkUrl={linkUrl}
          setLinkUrl={setLinkUrl}
          linkError={linkError}
          handleAddLink={handleAddLink}
        />
        {/* Display Submission Error Message */}
        {submitError && (
          <p className="text-red-500 text-sm mt-3 text-right">{submitError}</p>
        )}
        {/* Action Buttons - Use the new component */}
        <PostActions
          isSubmitting={isSubmitting}
          postText={postText}
          selectedMediaLength={selectedMedia.length}
          onCancel={handleCloseInternal} // Use existing close handler
          onSubmit={handlePostSubmit}
        />
      </div>
    </div>
  );
};

export default NewUserPost;
