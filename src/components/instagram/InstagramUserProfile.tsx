"use client";

import { useState, useEffect } from "react";
import { instagramAPI } from "@/lib/api";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import {
  Camera,
  ExternalLink,
  RefreshCw,
  Users,
  Grid3X3,
  CheckCircle,
  Globe,
  Loader2,
} from "lucide-react";

interface InstagramUser {
  id: string;
  username: string;
  name: string;
  bio?: string;
  profile_picture_url?: string;
  website?: string;
  followers_count: number;
  following_count: number;
  posts_count: number;
  is_verified: boolean;
  is_private: boolean;
  account_type?: string;
  created_at: string;
}

interface InstagramUserProfileProps {
  className?: string;
}

export default function InstagramUserProfile({
  className,
}: InstagramUserProfileProps) {
  const [user, setUser] = useState<InstagramUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async (sync = false) => {
    if (sync) {
      setIsSyncing(true);
    } else {
      setIsLoading(true);
    }

    try {
      console.log("Loading Instagram user profile...", { sync });

      // Note: This component expects the user to be already connected via OAuth
      // The access token should be stored in your backend and associated with the user
      const response = await instagramAPI.getUser({
        sync: sync ? "true" : "false",
      });

      console.log("User profile response:", response);

      // Handle new response structure
      if (response?.success !== false && response?.data) {
        setUser(response.data);

        if (sync) {
          toast.success("Profile synced successfully!");
        }
      } else if (response?.requiresConnection) {
        toast.error(
          response.message || "Please connect your Instagram account first"
        );
        setUser(null); // Clear user data if connection required
      }
    } catch (error: any) {
      console.error("Error loading user profile:", error);
      if (error.response?.status === 401) {
        toast.error("Please connect your Instagram account first");
      } else {
        toast.error(
          error.response?.data?.message || "Failed to load Instagram profile"
        );
      }
    } finally {
      setIsLoading(false);
      setIsSyncing(false);
    }
  };

  const syncProfile = () => {
    loadUserProfile(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getAccountTypeColor = (accountType?: string) => {
    switch (accountType?.toLowerCase()) {
      case "business":
        return "bg-blue-100 text-blue-700";
      case "creator":
        return "bg-purple-100 text-purple-700";
      case "personal":
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (isLoading) {
    return (
      <div className={cn("bg-white rounded-lg shadow-md p-6", className)}>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
          <span className="ml-2 text-gray-600">
            Loading Instagram profile...
          </span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={cn("bg-white rounded-lg shadow-md p-6", className)}>
        <div className="text-center py-12">
          <Camera className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Profile Found
          </h3>
          <p className="text-gray-600 mb-4">
            Connect your Instagram account to view your profile information.
          </p>
          <button
            onClick={() => loadUserProfile(true)}
            disabled={isSyncing}
            className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors"
          >
            {isSyncing ? "Loading..." : "Load Profile"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("bg-white rounded-lg shadow-md p-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <Camera className="h-6 w-6 mr-2 text-pink-500" />
          Instagram Profile
        </h2>
        <button
          onClick={syncProfile}
          disabled={isSyncing}
          className={cn(
            "flex items-center space-x-2 px-4 py-2 bg-pink-100 text-pink-700 rounded-lg hover:bg-pink-200 transition-colors",
            isSyncing && "opacity-50 cursor-not-allowed"
          )}
        >
          <RefreshCw className={cn("h-4 w-4", isSyncing && "animate-spin")} />
          <span>{isSyncing ? "Syncing..." : "Sync Profile"}</span>
        </button>
      </div>

      {/* Profile Content */}
      <div className="space-y-6">
        {/* Profile Header */}
        <div className="flex items-start space-x-6">
          {/* Profile Picture */}
          <div className="flex-shrink-0">
            {user.profile_picture_url ? (
              <img
                src={user.profile_picture_url}
                alt={user.username}
                className="w-24 h-24 rounded-full object-cover border-4 border-pink-100"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-pink-100 flex items-center justify-center border-4 border-pink-200">
                <Camera className="h-8 w-8 text-pink-500" />
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-2xl font-bold text-gray-900">{user.name}</h3>
              {user.is_verified && (
                <CheckCircle className="h-6 w-6 text-blue-500" />
              )}
            </div>

            <p className="text-lg text-gray-600 mb-3">@{user.username}</p>

            {user.bio && (
              <p className="text-gray-700 mb-4 leading-relaxed">{user.bio}</p>
            )}

            {user.website && (
              <div className="flex items-center space-x-2 mb-4">
                <Globe className="h-4 w-4 text-gray-500" />
                <a
                  href={user.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-600 hover:text-pink-700 flex items-center space-x-1"
                >
                  <span>{user.website}</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}

            {/* Account Type Badge */}
            {user.account_type && (
              <div className="mb-4">
                <span
                  className={cn(
                    "inline-block px-3 py-1 rounded-full text-sm font-medium",
                    getAccountTypeColor(user.account_type)
                  )}
                >
                  {user.account_type} Account
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 py-6 border-t border-b border-gray-200">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Grid3X3 className="h-5 w-5 text-pink-500 mr-1" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {user.posts_count.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Posts</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Users className="h-5 w-5 text-pink-500 mr-1" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {user.followers_count.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Followers</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Users className="h-5 w-5 text-pink-500 mr-1" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {user.following_count.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Following</div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Account Status:</span>
            <span
              className={cn(
                "px-2 py-1 rounded-full text-xs font-medium",
                user.is_private
                  ? "bg-orange-100 text-orange-700"
                  : "bg-green-100 text-green-700"
              )}
            >
              {user.is_private ? "Private" : "Public"}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Account Created:</span>
            <span className="text-gray-900">{formatDate(user.created_at)}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Instagram ID:</span>
            <span className="text-gray-900 font-mono text-xs">{user.id}</span>
          </div>
        </div>

        {/* Profile Link */}
        <div className="pt-4 border-t border-gray-200">
          <a
            href={`https://instagram.com/${user.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-200"
          >
            <Camera className="h-5 w-5" />
            <span>View on Instagram</span>
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
