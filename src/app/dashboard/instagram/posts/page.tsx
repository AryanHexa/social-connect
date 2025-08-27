"use client";

import React, { useState, useEffect } from "react";
import {
  Camera,
  FileText,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Heart,
  MessageSquare,
  Share,
  Eye,
  Calendar,
  Filter,
  Search,
  Plus,
  MoreHorizontal,
  LogOut,
} from "lucide-react";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import { instagramAPI } from "@/lib/api";
import toast from "react-hot-toast";

interface InstagramPost {
  id: string;
  caption: string;
  media_url: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  permalink: string;
  timestamp: string;
  like_count: number;
  comments_count: number;
  engagement_rate: number;
  reach: number;
  impressions: number;
  saved: number;
  shares: number;
}

export default function InstagramPostsPage() {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<
    "all" | "image" | "video" | "carousel"
  >("all");

  const handleConnectInstagram = async () => {
    try {
      setLoading(true);
      setError(null);

      // Call the Instagram login API
      const response = await fetch("/api/auth/instagram/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success && data.data.redirect) {
        // Redirect to Instagram OAuth
        window.location.href = data.data.authUrl;
      } else {
        setError("Failed to get Instagram auth URL");
      }
    } catch (error) {
      console.error("Error connecting Instagram:", error);
      setError("Failed to connect Instagram account");
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutInstagram = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await instagramAPI.logout();

      if (result.success) {
        setIsConnected(false);
        setPosts([]);
        toast.success("Successfully logged out from Instagram");
      } else {
        setError("Failed to logout from Instagram");
        toast.error("Failed to logout from Instagram");
      }
    } catch (error) {
      console.error("Error logging out from Instagram:", error);
      setError("Failed to logout from Instagram");
      toast.error("Failed to logout from Instagram");
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if user has Instagram access token (this would be stored in your auth system)
      // For now, we'll simulate checking connection status
      const hasInstagramToken = false; // Replace with actual token check

      if (!hasInstagramToken) {
        setIsConnected(false);
        setPosts([]);
        return;
      }

      // Mock posts data - replace with actual API call
      const mockPosts: InstagramPost[] = [
        {
          id: "1",
          caption:
            "Amazing sunset at the beach! 🌅 #sunset #beach #photography",
          media_url:
            "https://via.placeholder.com/400x400/FF6B6B/FFFFFF?text=Sunset",
          media_type: "IMAGE",
          permalink: "https://instagram.com/p/example1",
          timestamp: "2024-01-15T10:30:00Z",
          like_count: 1247,
          comments_count: 89,
          engagement_rate: 8.5,
          reach: 15600,
          impressions: 18900,
          saved: 234,
          shares: 45,
        },
        {
          id: "2",
          caption:
            "Behind the scenes of our latest project! 🎬 #bts #filmmaking",
          media_url:
            "https://via.placeholder.com/400x400/4ECDC4/FFFFFF?text=Video",
          media_type: "VIDEO",
          permalink: "https://instagram.com/p/example2",
          timestamp: "2024-01-14T15:45:00Z",
          like_count: 892,
          comments_count: 67,
          engagement_rate: 6.2,
          reach: 14300,
          impressions: 16800,
          saved: 156,
          shares: 23,
        },
        {
          id: "3",
          caption:
            "Product showcase featuring our latest collection 📸 #fashion #style",
          media_url:
            "https://via.placeholder.com/400x400/45B7D1/FFFFFF?text=Carousel",
          media_type: "CAROUSEL_ALBUM",
          permalink: "https://instagram.com/p/example3",
          timestamp: "2024-01-13T12:20:00Z",
          like_count: 2156,
          comments_count: 134,
          engagement_rate: 9.8,
          reach: 22100,
          impressions: 25600,
          saved: 445,
          shares: 78,
        },
      ];

      setPosts(mockPosts);
      setIsConnected(true);
    } catch (error) {
      console.error("Error fetching Instagram posts:", error);
      setIsConnected(false);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if Instagram is connected and fetch posts
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.caption
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterType === "all" ||
      post.media_type.toLowerCase() === filterType.toUpperCase();
    return matchesSearch && matchesFilter;
  });

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const getMediaTypeIcon = (type: string) => {
    switch (type) {
      case "VIDEO":
        return "🎬";
      case "CAROUSEL_ALBUM":
        return "📷";
      default:
        return "📸";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Instagram Posts
            </h1>
            <p className="text-gray-600">
              View and manage your Instagram posts and content.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {isConnected ? (
              <>
                <div className="flex items-center text-green-600">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">Connected</span>
                </div>
                <button
                  onClick={handleLogoutInstagram}
                  disabled={loading}
                  className="flex items-center px-3 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {loading ? "Logging out..." : "Logout"}
                </button>
              </>
            ) : (
              <div className="flex items-center text-orange-600">
                <AlertCircle className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Not Connected</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Connection Status */}
      {!isConnected && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <div className="flex items-center">
            <AlertCircle className="w-6 h-6 text-orange-600 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-orange-800">
                Instagram Account Not Connected
              </h3>
              <p className="text-orange-700 mt-1">
                Connect your Instagram account to view and manage your posts.
              </p>
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={handleConnectInstagram}
              disabled={loading}
              className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors flex items-center disabled:opacity-50"
            >
              <Camera className="w-5 h-5 mr-2" />
              {loading ? "Connecting..." : "Connect Instagram Account"}
            </button>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      {isConnected && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search posts by caption..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="all">All Types</option>
                <option value="image">Images</option>
                <option value="video">Videos</option>
                <option value="carousel">Carousels</option>
              </select>
              <button
                onClick={fetchPosts}
                disabled={loading}
                className="flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Posts Grid */}
      {isConnected && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              {/* Post Image */}
              <div className="relative">
                <img
                  src={post.media_url}
                  alt={post.caption}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                  {getMediaTypeIcon(post.media_type)}
                </div>
                <div className="absolute top-2 left-2 bg-pink-600 text-white px-2 py-1 rounded text-sm">
                  {post.engagement_rate.toFixed(1)}% engagement
                </div>
              </div>

              {/* Post Content */}
              <div className="p-4">
                <p className="text-gray-900 text-sm mb-3 line-clamp-3">
                  {post.caption}
                </p>

                {/* Post Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center text-red-500 mb-1">
                      <Heart className="w-4 h-4 mr-1" />
                      <span className="text-sm font-medium">
                        {formatNumber(post.like_count)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">Likes</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center text-blue-500 mb-1">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      <span className="text-sm font-medium">
                        {formatNumber(post.comments_count)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">Comments</div>
                  </div>
                </div>

                {/* Additional Stats */}
                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Reach:</span>
                    <span>{formatNumber(post.reach)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Impressions:</span>
                    <span>{formatNumber(post.impressions)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saved:</span>
                    <span>{formatNumber(post.saved)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shares:</span>
                    <span>{formatNumber(post.shares)}</span>
                  </div>
                </div>

                {/* Post Date */}
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(post.timestamp).toLocaleDateString()}
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 flex space-x-2">
                  <a
                    href={post.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-pink-600 text-white text-center py-2 rounded-lg hover:bg-pink-700 transition-colors text-sm"
                  >
                    View on Instagram
                  </a>
                  <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {isConnected && filteredPosts.length === 0 && !loading && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-center py-12">
            <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Posts Found
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || filterType !== "all"
                ? "No posts match your current search or filter criteria."
                : "Connect your Instagram account to view your posts."}
            </p>
            {searchTerm || filterType !== "all" ? (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterType("all");
                }}
                className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
              >
                Clear Filters
              </button>
            ) : (
              <button
                onClick={handleConnectInstagram}
                className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
              >
                Connect Instagram
              </button>
            )}
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="w-6 h-6 animate-spin text-pink-600 mr-2" />
            <span className="text-gray-600">Loading posts...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <AlertCircle className="w-6 h-6 text-red-400 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-red-800">
                Error Loading Posts
              </h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
