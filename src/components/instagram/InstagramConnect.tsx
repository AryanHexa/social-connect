"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/lib/auth";
import { instagramAPI } from "@/lib/api";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { Camera, ExternalLink, LogOut, Loader2 } from "lucide-react";

interface InstagramUser {
  id: string;
  username: string;
  name: string;
  bio?: string;
  profile_picture_url?: string;
  followers_count: number;
  following_count: number;
  posts_count: number;
  is_verified: boolean;
  account_type?: string;
}

export default function InstagramConnect() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<InstagramUser | null>(null);
  const [accessToken, setAccessToken] = useState("");
  const { user: authUser } = useAuthStore();

  // Check if already connected on component mount
  useEffect(() => {
    checkConnection();
  }, []);

  // Handle OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const state = urlParams.get("state");

    if (code && state && authUser) {
      handleOAuthCallback(code, state);
    }
  }, [authUser]);

  const checkConnection = async () => {
    if (!authUser) return;

    setIsLoading(true);
    try {
      // Try to get user without sync first
      const response = await instagramAPI.getUser({ sync: "false" });
      if (response?.data) {
        setUser(response.data);
        toast.success("Instagram account connected!");
      }
    } catch (error: any) {
      console.log("Instagram not connected yet:", error.message);
      // Not connected yet, which is fine
    } finally {
      setIsLoading(false);
    }
  };

  const connectViaOAuth = async () => {
    if (!authUser) {
      toast.error("Please login first");
      return;
    }

    setIsConnecting(true);
    try {
      console.log("Generating Instagram auth URL...");
      const response = await instagramAPI.generateAuthUrl();
      console.log("Generated auth URL:", response);

      if (response.authUrl) {
        // Store state in localStorage for verification
        localStorage.setItem("instagram_oauth_state", response.state);
        localStorage.setItem(
          "instagram_oauth_timestamp",
          Date.now().toString()
        );

        // Redirect to Instagram OAuth
        window.location.href = response.authUrl;
      } else {
        throw new Error("Failed to generate auth URL");
      }
    } catch (error: any) {
      console.error("OAuth connection error:", error);
      toast.error(
        error.response?.data?.message || "Failed to connect Instagram account"
      );
      setIsConnecting(false);
    }
  };

  const handleOAuthCallback = async (code: string, state: string) => {
    if (!authUser) {
      toast.error("Authentication required");
      return;
    }

    setIsConnecting(true);
    try {
      console.log("Processing Instagram OAuth callback...");

      // Verify state parameter
      const storedState = localStorage.getItem("instagram_oauth_state");
      const storedTimestamp = localStorage.getItem("instagram_oauth_timestamp");

      if (!storedState || storedState !== state) {
        throw new Error("Invalid state parameter");
      }

      // Check if the OAuth flow is not too old (10 minutes)
      const timestamp = parseInt(storedTimestamp || "0");
      if (Date.now() - timestamp > 10 * 60 * 1000) {
        throw new Error("OAuth flow expired, please try again");
      }

      // Clean up localStorage
      localStorage.removeItem("instagram_oauth_state");
      localStorage.removeItem("instagram_oauth_timestamp");

      // Process the callback
      const response = await instagramAPI.handleOAuthCallback({
        code,
        state,
        userId: Number(authUser.id),
      });

      console.log("OAuth callback response:", response);

      if (response.success) {
        toast.success("Instagram account connected successfully!");

        // Store the access token if returned (flat response structure)
        if (response.accessToken) {
          setAccessToken(response.accessToken);
        }

        // Only fetch user data if callback was successful
        try {
          // Pass the access token to user API call
          const token = response.accessToken;
          if (token) {
            console.log("Using access token from OAuth callback:", {
              hasToken: !!token,
              username: response.username,
              instagramUserId: response.instagramUserId,
              platform: response.platform,
            });
            const userResponse = await instagramAPI.getUser(
              { sync: "false" },
              token
            );
            if (userResponse?.data) {
              setUser(userResponse.data);
              toast.success("User profile loaded successfully!");
            }
          } else {
            console.log("No access token in response, trying checkConnection");
            await checkConnection();
          }
        } catch (userError: any) {
          console.warn(
            "Failed to fetch user data after successful OAuth:",
            userError
          );
          // Don't throw here - OAuth was successful, user data fetch is secondary
        }

        // Clean up URL
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
      } else {
        throw new Error(response.message || "Failed to connect account");
      }
    } catch (error: any) {
      console.error("OAuth callback error:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to connect Instagram account"
      );

      // Clean up URL on error
      window.history.replaceState({}, document.title, window.location.pathname);
    } finally {
      setIsConnecting(false);
    }
  };

  const connectWithToken = async () => {
    if (!accessToken.trim()) {
      toast.error("Please enter an access token");
      return;
    }

    setIsConnecting(true);
    try {
      console.log("Connecting with access token...");
      const response = await instagramAPI.getUser(
        { sync: "true" },
        accessToken.trim()
      );

      console.log("Token connection response:", response);

      if (response?.data) {
        setUser(response.data);
        toast.success("Instagram account connected successfully!");
        setAccessToken("");
      } else {
        throw new Error("Failed to fetch user data");
      }
    } catch (error: any) {
      console.error("Token connection error:", error);
      toast.error(
        error.response?.data?.message || "Failed to connect Instagram account"
      );
    } finally {
      setIsConnecting(false);
    }
  };

  const syncData = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      console.log("Syncing Instagram data...");
      const response = await instagramAPI.getUser({ sync: "true" });

      if (response?.data) {
        setUser(response.data);
        toast.success("Instagram data synced successfully!");
      }
    } catch (error: any) {
      console.error("Sync error:", error);
      toast.error(
        error.response?.data?.message || "Failed to sync Instagram data"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      console.log("Disconnecting Instagram account...");
      await instagramAPI.logout();

      setUser(null);
      setAccessToken("");
      toast.success("Instagram account disconnected successfully!");
    } catch (error: any) {
      console.error("Disconnect error:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to disconnect Instagram account"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
          <span className="ml-2 text-gray-600">
            Loading Instagram connection...
          </span>
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <Camera className="h-6 w-6 mr-2 text-pink-500" />
            Instagram Account
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={syncData}
              disabled={isLoading}
              className="px-3 py-1 bg-pink-100 text-pink-700 rounded-md hover:bg-pink-200 transition-colors text-sm disabled:opacity-50"
            >
              {isLoading ? "Syncing..." : "Sync Data"}
            </button>
            <button
              onClick={disconnect}
              disabled={isLoading}
              className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm disabled:opacity-50 flex items-center"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Disconnect
            </button>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          {user.profile_picture_url && (
            <img
              src={user.profile_picture_url}
              alt={user.username}
              className="w-16 h-16 rounded-full object-cover"
            />
          )}

          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {user.name}
              </h3>
              {user.is_verified && (
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white"
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

            <p className="text-gray-600">@{user.username}</p>

            {user.bio && (
              <p className="text-gray-700 mt-2 text-sm">{user.bio}</p>
            )}

            <div className="flex items-center space-x-6 mt-3 text-sm text-gray-600">
              <span>
                <strong>{user.posts_count}</strong> posts
              </span>
              <span>
                <strong>{user.followers_count.toLocaleString()}</strong>{" "}
                followers
              </span>
              <span>
                <strong>{user.following_count.toLocaleString()}</strong>{" "}
                following
              </span>
            </div>

            {user.account_type && (
              <div className="mt-2">
                <span className="inline-block px-2 py-1 bg-pink-100 text-pink-700 text-xs rounded-full">
                  {user.account_type}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            ✅ Connected successfully! You can now use Instagram features.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="text-center">
        <Camera className="h-12 w-12 text-pink-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Connect Instagram Account
        </h2>
        <p className="text-gray-600 mb-6">
          Connect your Instagram account to access posts, analytics, and content
          generation.
        </p>

        {/* OAuth Connection (Recommended) */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            🔒 Secure OAuth Connection (Recommended)
          </h3>
          <button
            onClick={connectViaOAuth}
            disabled={isConnecting}
            className={cn(
              "w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2",
              isConnecting
                ? "opacity-50 cursor-not-allowed"
                : "hover:from-pink-600 hover:to-purple-700 hover:shadow-lg transform hover:-translate-y-0.5"
            )}
          >
            {isConnecting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <Camera className="h-5 w-5" />
                <span>Connect with Instagram</span>
                <ExternalLink className="h-4 w-4" />
              </>
            )}
          </button>
          <p className="text-xs text-gray-500 mt-2">
            Secure OAuth2 flow - no need to share your password
          </p>
        </div>

        {/* Manual Token Input (Alternative) */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            🔑 Manual Access Token (Alternative)
          </h3>
          <div className="space-y-4">
            <div>
              <input
                type="password"
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                placeholder="Enter your Instagram access token"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Get your token from Instagram Basic Display API
              </p>
            </div>
            <button
              onClick={connectWithToken}
              disabled={isConnecting || !accessToken.trim()}
              className={cn(
                "w-full bg-gray-600 text-white py-3 px-6 rounded-lg font-medium transition-colors",
                isConnecting || !accessToken.trim()
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-700"
              )}
            >
              {isConnecting ? "Connecting..." : "Connect with Token"}
            </button>
          </div>
        </div>

        <div className="mt-6 text-xs text-gray-500">
          <p>
            By connecting your Instagram account, you agree to allow this
            application to access your basic profile information and posts.
          </p>
        </div>
      </div>
    </div>
  );
}
