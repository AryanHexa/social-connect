"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { xAPI } from "@/lib/api";
import { useAuthStore } from "@/lib/auth";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { Twitter, LogOut } from "lucide-react";

interface ConnectFormData {
  accessToken: string;
  username?: string;
}

export default function TwitterConnect() {
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuthStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ConnectFormData>();

  // Check connection status on mount
  useEffect(() => {
    if (user) {
      checkConnection();
    }
  }, [user]);

  const checkConnection = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Try to get user without access token - backend will handle token retrieval
      const response = await xAPI.getUser({ sync: "false" });

      // Handle the response structure
      if (response?.success !== false && response?.data) {
        setIsConnected(true);
        toast.success("Twitter account connected!");
      } else if (response?.requiresConnection) {
        // User needs to connect or reconnect
        console.log("Twitter connection required:", response.message);
        setIsConnected(false);
      }
    } catch (error: any) {
      console.log("Twitter not connected yet:", error.message);
      // Not connected yet, which is fine
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check for OAuth callback parameters
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const state = urlParams.get("state");
    const error = urlParams.get("error");
    const errorDescription = urlParams.get("error_description");

    if (code && state) {
      console.log("OAuth callback detected!");
      console.log({ code, state });
      handleOAuthCallback(code, state);
    } else if (error) {
      toast.error(errorDescription || "OAuth authorization failed");
      // Clean up URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleOAuthCallback = async (code: string, state: string) => {
    try {
      setIsLoading(true);
      console.log("Handling OAuth callback with backend...");

      if (!user) {
        throw new Error("User not authenticated");
      }

      const result = await xAPI.handleOAuthCallback({
        code,
        state,
        userId: user.id.toString(),
      });
      console.log("OAuth callback result:", result);

      if (result.success) {
        setIsConnected(true);
        toast.success(
          result.message || "Twitter account connected successfully via OAuth!"
        );

        // Store access token if needed (optional)
        if (result.accessToken) {
          console.log("Access token received:", result.accessToken);
          // You can store this token if needed for immediate use
        }
      } else {
        toast.error(result.message || "Failed to connect Twitter account");
      }
    } catch (error: any) {
      console.error("OAuth callback error:", error);
      toast.error(
        error.response?.data?.message || "Failed to complete OAuth flow"
      );
    } finally {
      setIsLoading(false);
      // Clean up URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  };

  const handleOAuthLogin = async () => {
    try {
      setIsLoading(true);
      console.log("Generating OAuth URL from backend...");

      const result = await xAPI.generateAuthUrl();
      console.log("Generated auth URL:", result);

      if (result.authUrl) {
        // Generate and store state parameter for security
        const state = Math.random().toString(36).substring(2, 15);
        const timestamp = Date.now().toString();

        localStorage.setItem("twitter_oauth_state", state);
        localStorage.setItem("twitter_oauth_timestamp", timestamp);

        // Append state to the auth URL
        const authUrlWithState = `${result.authUrl}&state=${state}`;

        console.log("Redirecting to Twitter OAuth with state:", state);
        window.location.href = authUrlWithState;
      } else {
        toast.error("Failed to generate OAuth URL");
      }
    } catch (error: any) {
      console.error("OAuth initiation error:", error);
      toast.error(
        error.response?.data?.message || "Failed to initiate OAuth flow"
      );
      setIsLoading(false);
    }
  };

  // Function to manually fetch user data (call this after successful connection)
  const fetchUserData = async () => {
    try {
      const userResponse = await xAPI.getUser();
      console.log("User data fetched after connection:", userResponse);
      return userResponse;
    } catch (error: any) {
      console.error("Failed to fetch user data:", error);
      toast.error("Failed to fetch user data");
      throw error;
    }
  };

  const handleLogoutTwitter = async () => {
    try {
      setIsLoading(true);
      const result = await xAPI.logout();

      if (result.success) {
        setIsConnected(false);
        toast.success("Successfully logged out from Twitter");
      } else {
        toast.error("Failed to logout from Twitter");
      }
    } catch (error: any) {
      console.error("Error logging out from Twitter:", error);
      toast.error("Failed to logout from Twitter");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: ConnectFormData) => {
    setIsLoading(true);
    try {
      const response = await xAPI.connectTwitterAccount(
        data.accessToken,
        data.username
      );
      if (response.success) {
        setIsConnected(true);
        toast.success("Twitter account connected successfully!");
        reset();
      } else {
        toast.error(response.message || "Failed to connect Twitter account");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to connect Twitter account"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center mb-6">
        <Twitter className="w-8 h-8 text-blue-400 mr-3" />
        <h2 className="text-2xl font-bold text-gray-900">
          Connect Twitter Account
        </h2>
      </div>

      {isConnected && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-800">
            ✅ Twitter account connected successfully!
          </p>
        </div>
      )}

      <div className="mb-6 space-y-3">
        <button
          onClick={handleOAuthLogin}
          disabled={isLoading}
          className="w-full bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center justify-center disabled:opacity-50"
        >
          <Twitter className="w-5 h-5 mr-2" />
          {isLoading ? "Connecting..." : "Connect with Twitter OAuth"}
        </button>

        {isConnected && (
          <>
            <button
              onClick={fetchUserData}
              className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center justify-center"
            >
              📊 Fetch User Data (After Connection)
            </button>
            <button
              onClick={handleLogoutTwitter}
              disabled={isLoading}
              className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors flex items-center justify-center disabled:opacity-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              {isLoading ? "Logging out..." : "Logout from Twitter"}
            </button>
          </>
        )}
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">
            Or connect manually
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div>
          <label
            htmlFor="accessToken"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Twitter Access Token
          </label>
          <input
            {...register("accessToken", {
              required: "Access token is required",
            })}
            type="text"
            id="accessToken"
            className={cn(
              "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
              errors.accessToken
                ? "border-red-300 focus:ring-red-500"
                : "border-gray-300"
            )}
            placeholder="Enter your Twitter access token"
          />
          {errors.accessToken && (
            <p className="mt-1 text-sm text-red-600">
              {errors.accessToken.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Twitter Username (Optional)
          </label>
          <input
            {...register("username")}
            type="text"
            id="username"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your Twitter username"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
        >
          {isLoading ? "Connecting..." : "Connect Manually"}
        </button>
      </form>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <h3 className="text-sm font-semibold text-blue-800 mb-2">
          How to get your Twitter Access Token:
        </h3>
        <ol className="text-sm text-blue-700 space-y-1">
          <li>1. Go to Twitter Developer Portal</li>
          <li>2. Create a new app or use existing app</li>
          <li>3. Set up OAuth 2.0 with PKCE</li>
          <li>4. Generate access token with required scopes</li>
          <li>5. Copy the access token and paste it above</li>
        </ol>
        <p className="text-xs text-blue-600 mt-2">
          <strong>Required scopes:</strong> tweet.read, users.read,
          offline.access
        </p>
      </div>
    </div>
  );
}
