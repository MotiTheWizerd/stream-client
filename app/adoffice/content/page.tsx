"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit,
  Trash2,
  Image,
  Video,
  File,
} from "lucide-react";

type MediaType = "image" | "video" | "file";

interface Media {
  url: string;
  type: MediaType;
  title: string;
}

interface Post {
  id: string;
  content: string;
  mediaUrls: Media[];
  visibility: "PUBLIC" | "SUBSCRIBERS";
  createdAt: string;
  author: {
    id: string;
    username: string;
    avatar: string;
  };
  views: number;
}

const MediaIcon = ({ type }: { type: MediaType }) => {
  switch (type) {
    case "image":
      return <Image size={16} className="text-blue-500" />;
    case "video":
      return <Video size={16} className="text-red-500" />;
    case "file":
      return <File size={16} className="text-gray-500" />;
  }
};

export default function ContentPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [posts] = useState<Post[]>([
    {
      id: "1",
      content:
        "This is my first live streaming session! Join me today at 8PM EST.",
      mediaUrls: [
        {
          url: "https://example.com/image1.jpg",
          type: "image",
          title: "Stream Thumbnail",
        },
      ],
      visibility: "PUBLIC",
      createdAt: "2024-04-01",
      author: {
        id: "1",
        username: "johndoe",
        avatar: "https://i.pravatar.cc/150?u=1",
      },
      views: 324,
    },
    {
      id: "2",
      content: "Check out my latest video tutorial on React hooks!",
      mediaUrls: [
        {
          url: "https://example.com/video1.mp4",
          type: "video",
          title: "React Hooks Tutorial",
        },
      ],
      visibility: "SUBSCRIBERS",
      createdAt: "2024-03-28",
      author: {
        id: "2",
        username: "janesmith",
        avatar: "https://i.pravatar.cc/150?u=2",
      },
      views: 1205,
    },
    {
      id: "3",
      content: "Here are some resources for learning web development.",
      mediaUrls: [
        {
          url: "https://example.com/file1.pdf",
          type: "file",
          title: "Web Dev Cheatsheet",
        },
        {
          url: "https://example.com/file2.pdf",
          type: "file",
          title: "CSS Grid Guide",
        },
      ],
      visibility: "PUBLIC",
      createdAt: "2024-03-25",
      author: {
        id: "3",
        username: "alexjohnson",
        avatar: "https://i.pravatar.cc/150?u=3",
      },
      views: 867,
    },
    {
      id: "4",
      content: "Photos from our community meetup last weekend!",
      mediaUrls: [
        {
          url: "https://example.com/image2.jpg",
          type: "image",
          title: "Group Photo",
        },
        {
          url: "https://example.com/image3.jpg",
          type: "image",
          title: "Workshop Session",
        },
        {
          url: "https://example.com/image4.jpg",
          type: "image",
          title: "Networking Event",
        },
      ],
      visibility: "PUBLIC",
      createdAt: "2024-03-22",
      author: {
        id: "4",
        username: "sarahwilliams",
        avatar: "https://i.pravatar.cc/150?u=4",
      },
      views: 532,
    },
    {
      id: "5",
      content: "Exclusive coding challenge for my subscribers!",
      mediaUrls: [],
      visibility: "SUBSCRIBERS",
      createdAt: "2024-03-15",
      author: {
        id: "5",
        username: "mikebrown",
        avatar: "https://i.pravatar.cc/150?u=5",
      },
      views: 189,
    },
  ]);

  const filteredPosts = posts.filter(
    (post) =>
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Content Management</h1>
        <p className="text-gray-500 mt-1">
          Manage all user-generated content on the platform
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search content..."
            className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border rounded-lg">
          <Filter size={18} />
          <span>Filters</span>
        </button>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Create Content
        </button>
      </div>

      {/* Content Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Content
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Author
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Visibility
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Views
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredPosts.map((post) => (
              <tr key={post.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <p className="text-sm text-gray-900 line-clamp-2">
                      {post.content}
                    </p>
                    {post.mediaUrls.length > 0 && (
                      <div className="mt-2 flex items-center gap-2">
                        {post.mediaUrls.map((media, index) => (
                          <div
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100"
                          >
                            <MediaIcon type={media.type} />
                            <span className="ml-1">{media.title}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-8 w-8 flex-shrink-0">
                      <img
                        className="h-8 w-8 rounded-full"
                        src={post.author.avatar}
                        alt={post.author.username}
                      />
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        {post.author.username}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {post.createdAt}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs rounded-full ${
                      post.visibility === "PUBLIC"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {post.visibility === "PUBLIC"
                      ? "Public"
                      : "Subscribers Only"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {post.views.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end items-center space-x-3">
                    <button
                      className="text-gray-400 hover:text-gray-600"
                      title="View"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredPosts.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No content found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing <span className="font-medium">1</span> to{" "}
          <span className="font-medium">5</span> of{" "}
          <span className="font-medium">42</span> content items
        </div>
        <div className="flex space-x-2">
          <button className="inline-flex items-center px-4 py-2 border rounded-lg text-sm text-gray-700 hover:bg-gray-50">
            <ChevronLeft size={16} className="mr-1" />
            Previous
          </button>
          <button className="inline-flex items-center px-4 py-2 border rounded-lg text-sm text-gray-700 hover:bg-gray-50">
            Next
            <ChevronRight size={16} className="ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
