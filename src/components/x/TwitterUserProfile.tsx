"use client";

import { useState, useEffect } from "react";
import { xAPI } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import toast from "react-hot-toast";
import { User, Calendar, MapPin, Link, RefreshCw, LogOut } from "lucide-react";

interface TwitterUser {
  id: string;
  username: string;
  name: string;
  description?: string;
  profile_image_url?: string;
  location?: string;
  url?: string;
  created_at?: string;
  followers_count?: number;
  following_count?: number;
  tweet_count?: number;
  verified?: boolean;
}

interface TwitterUserProfileProps {
  twitterId?: string;
}

export default function TwitterUserProfile({
  twitterId,
}: TwitterUserProfileProps) {
  const [user, setUser] = useState<TwitterUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sync, setSync] = useState(false);

  const fetchUser = async (syncData = false) => {
    setIsLoading(true);
    try {
      let response;
      if (twitterId) {
        response = await xAPI.getUserByTwitterId(twitterId);
      } else {
        response = await xAPI.getUser({ sync: syncData ? "true" : "false" });
      }

      if (response.data) {
        setUser(response.data);
        if (syncData) {
          toast.success("User data synced from Twitter!");
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch user data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [twitterId]);

  const handleSync = () => {
    setSync(true);
    fetchUser(true);
  };

  const handleLogoutTwitter = async () => {
    try {
      setIsLoading(true);
      const result = await xAPI.logout();

      if (result.success) {
        setUser(null);
        toast.success("Successfully logged out from Twitter");
      } else {
        toast.error("Failed to logout from Twitter");
      }
    } catch (error) {
      console.error("Error logging out from Twitter:", error);
      toast.error("Failed to logout from Twitter");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !user) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center text-gray-500">
          <User className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No user data available</p>
          <button
            onClick={() => fetchUser(true)}
            className="mt-4 text-blue-600 hover:text-blue-700"
          >
            Sync from Twitter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img
              src={user.profile_image_url || "/default-avatar.png"}
              alt={user.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            {user.verified && (
              <div className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full p-1">
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-gray-600">@{user.username}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleSync}
            disabled={isLoading}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            />
            <span>Sync</span>
          </button>
          <button
            onClick={handleLogoutTwitter}
            disabled={isLoading}
            className="flex items-center space-x-2 text-red-600 hover:text-red-700 disabled:opacity-50"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {user.description && (
        <p className="text-gray-700 mb-4">{user.description}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {user.followers_count?.toLocaleString() || 0}
          </div>
          <div className="text-sm text-gray-600">Followers</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {user.following_count?.toLocaleString() || 0}
          </div>
          <div className="text-sm text-gray-600">Following</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {user.tweet_count?.toLocaleString() || 0}
          </div>
          <div className="text-sm text-gray-600">Tweets</div>
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        {user.location && (
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{user.location}</span>
          </div>
        )}

        {user.url && (
          <div className="flex items-center">
            <Link className="w-4 h-4 mr-2" />
            <a
              href={user.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {user.url}
            </a>
          </div>
        )}

        {user.created_at && (
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            <span>Joined {formatDate(user.created_at)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
