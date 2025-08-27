"use client";

import React, { useState, useEffect } from "react";
import {
  Camera,
  User,
  Link,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Calendar,
  MapPin,
  Globe,
  Users,
  MessageSquare,
  Heart,
  Share,
  LogOut,
} from "lucide-react";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import { instagramAPI } from "@/lib/api";
import toast from "react-hot-toast";

interface InstagramProfile {
  id: string;
  username: string;
  full_name: string;
  profile_picture_url: string;
  bio: string;
  website: string;
  followers_count: number;
  following_count: number;
  media_count: number;
  is_private: boolean;
  is_verified: boolean;
  created_at: string;
}

export default function InstagramProfilePage() {
  const [profile, setProfile] = useState<InstagramProfile | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        setProfile(null);
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

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if user has Instagram access token (this would be stored in your auth system)
      // For now, we'll simulate checking connection status
      const hasInstagramToken = false; // Replace with actual token check

      if (!hasInstagramToken) {
        setIsConnected(false);
        setProfile(null);
        return;
      }

      // Mock profile data - replace with actual API call
      const mockProfile: InstagramProfile = {
        id: "123456789",
        username: "example_user",
        full_name: "Example User",
        profile_picture_url: "https://via.placeholder.com/150",
        bio: "Digital creator | Content strategist | Social media enthusiast",
        website: "https://example.com",
        followers_count: 15420,
        following_count: 892,
        media_count: 156,
        is_private: false,
        is_verified: true,
        created_at: "2020-01-15T00:00:00Z",
      };

      setProfile(mockProfile);
      setIsConnected(true);
    } catch (error) {
      console.error("Error fetching Instagram profile:", error);
      setIsConnected(false);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if Instagram is connected and fetch profile
    fetchProfile();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Instagram Profile
            </h1>
            <p className="text-gray-600">
              View and manage your Instagram profile information.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {isConnected ? (
              <div className="flex items-center text-green-600">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Connected</span>
              </div>
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
                Connect your Instagram account to view your profile and manage
                your content.
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

      {/* Profile Information */}
      {isConnected && profile && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-center">
                <div className="relative inline-block">
                  <img
                    src={profile.profile_picture_url}
                    alt={profile.full_name}
                    className="w-32 h-32 rounded-full mx-auto mb-4"
                  />
                  {profile.is_verified && (
                    <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full p-1">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {profile.full_name}
                </h2>
                <p className="text-gray-600 mb-3">@{profile.username}</p>
                {profile.bio && (
                  <p className="text-gray-700 mb-4">{profile.bio}</p>
                )}
                {profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-600 hover:text-pink-700 flex items-center justify-center"
                  >
                    <Globe className="w-4 h-4 mr-1" />
                    {profile.website}
                  </a>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {profile.media_count.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Posts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {profile.followers_count.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {profile.following_count.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Following</div>
                </div>
              </div>

              {/* Account Info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>
                      Joined {new Date(profile.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="w-4 h-4 mr-2" />
                    <span>
                      {profile.is_private
                        ? "Private Account"
                        : "Public Account"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Profile Details
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <p className="text-gray-900">@{profile.username}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <p className="text-gray-900">{profile.full_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <p className="text-gray-900">{profile.bio || "No bio"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Website
                  </label>
                  <p className="text-gray-900">
                    {profile.website || "No website"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Type
                  </label>
                  <p className="text-gray-900">
                    {profile.is_private ? "Private" : "Public"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Verification Status
                  </label>
                  <p className="text-gray-900">
                    {profile.is_verified ? "Verified" : "Not Verified"}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Refresh Profile
                </button>
                <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Link className="w-5 h-5 mr-2" />
                  View on Instagram
                </button>
                <button
                  onClick={handleLogoutInstagram}
                  disabled={loading}
                  className="flex items-center justify-center px-4 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  {loading ? "Logging out..." : "Logout from Instagram"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="w-6 h-6 animate-spin text-pink-600 mr-2" />
            <span className="text-gray-600">Loading profile...</span>
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
                Error Loading Profile
              </h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
