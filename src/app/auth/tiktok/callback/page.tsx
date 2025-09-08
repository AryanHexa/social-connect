"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/lib/auth";
import { tiktokAPI } from "@/lib/api";
import { Loader2, CheckCircle, XCircle, Music } from "lucide-react";
import toast from "react-hot-toast";

function TikTokCallbackContent() {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuthStore();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get("code");
        let state = searchParams.get("state");
        const error = searchParams.get("error");
        const errorDescription = searchParams.get("error_description");

        // Debug logging
        console.log("TikTok callback params:", {
          code: code ? `${code.substring(0, 20)}...` : null,
          state,
          error,
          errorDescription,
          fullUrl: window.location.href,
          searchParams: Object.fromEntries(searchParams.entries()),
        });

        // Check for OAuth errors
        if (error) {
          throw new Error(errorDescription || `TikTok OAuth error: ${error}`);
        }

        if (!code) {
          throw new Error("Missing authorization code");
        }

        if (!state) {
          console.warn("State parameter missing from TikTok callback");
          // Try to get state from localStorage as fallback
          const storedState = localStorage.getItem("tiktok_oauth_state");
          const storedTimestamp = localStorage.getItem(
            "tiktok_oauth_timestamp"
          );

          if (!storedState) {
            throw new Error(
              "No state parameter found. Please try connecting again."
            );
          }

          // Check if the OAuth flow is not too old (10 minutes)
          const timestamp = parseInt(storedTimestamp || "0");
          if (Date.now() - timestamp > 10 * 60 * 1000) {
            throw new Error("OAuth flow expired. Please try connecting again.");
          }

          console.log("Using stored state as fallback:", storedState);
          // Use stored state for the callback
          state = storedState;
        }

        if (!user) {
          throw new Error("User not authenticated. Please login first.");
        }

        // Verify state parameter (if we didn't already handle it above)
        if (searchParams.get("state")) {
          const storedState = localStorage.getItem("tiktok_oauth_state");
          const storedTimestamp = localStorage.getItem(
            "tiktok_oauth_timestamp"
          );

          if (!storedState || storedState !== state) {
            throw new Error(
              "Invalid state parameter. Please try connecting again."
            );
          }

          // Check if the OAuth flow is not too old (10 minutes)
          const timestamp = parseInt(storedTimestamp || "0");
          if (Date.now() - timestamp > 10 * 60 * 1000) {
            throw new Error("OAuth flow expired. Please try connecting again.");
          }
        }

        setMessage("Processing TikTok connection...");

        // Process the callback - Updated to match gateway controller structure
        const response = await tiktokAPI.handleOAuthCallback({
          code,
          state,
          userId: user.id.toString(), // Convert to string as expected by gateway
        });

        console.log(
          "***TikTok OAuth Callback Response in page.tsx***",
          response
        );

        if (response.success) {
          setStatus("success");
          setMessage("TikTok account connected successfully!");
          toast.success("TikTok account connected!");

          // Clean up localStorage
          localStorage.removeItem("tiktok_oauth_state");
          localStorage.removeItem("tiktok_oauth_timestamp");

          // Redirect to TikTok dashboard after 2 seconds
          setTimeout(() => {
            router.push("/dashboard/tiktok");
          }, 2000);

          // store data from response in local storage
          localStorage.setItem(
            "tiktok_user",
            JSON.stringify(response.username)
          );
        } else {
          throw new Error(
            response.message || "Failed to connect TikTok account"
          );
        }
      } catch (error: any) {
        console.error("TikTok callback error:", error);
        setStatus("error");
        setMessage(error.message || "Failed to connect TikTok account");
        toast.error(error.message || "Failed to connect TikTok account");

        // Clean up localStorage on error
        localStorage.removeItem("tiktok_oauth_state");
        localStorage.removeItem("tiktok_oauth_timestamp");

        // Redirect to TikTok dashboard after 3 seconds
        setTimeout(() => {
          router.push("/dashboard/tiktok");
        }, 3000);
      }
    };

    if (searchParams) {
      handleCallback();
    }
  }, [searchParams, user, router]);

  const getStatusIcon = () => {
    switch (status) {
      case "loading":
        return <Loader2 className="h-16 w-16 text-black animate-spin" />;
      case "success":
        return <CheckCircle className="h-16 w-16 text-green-500" />;
      case "error":
        return <XCircle className="h-16 w-16 text-red-500" />;
      default:
        return <Music className="h-16 w-16 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "loading":
        return "text-black";
      case "success":
        return "text-green-600";
      case "error":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">{getStatusIcon()}</div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            TikTok Connection
          </h1>

          <p className={`text-lg ${getStatusColor()} mb-6`}>{message}</p>

          {status === "loading" && (
            <div className="space-y-2">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-600">
                  Please wait while we connect your TikTok account...
                </p>
              </div>
            </div>
          )}

          {status === "success" && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-700">
                  ✅ Your TikTok account has been successfully connected!
                </p>
              </div>
              <p className="text-sm text-gray-600">
                Redirecting you to the TikTok dashboard...
              </p>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-700">
                  ❌ There was an error connecting your TikTok account.
                </p>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => router.push("/dashboard/tiktok")}
                  className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Go to TikTok Dashboard
                </button>
                <p className="text-xs text-gray-500">
                  You can try connecting again from the dashboard.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Loading component for Suspense fallback
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Loader2 className="h-16 w-16 text-black animate-spin" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            TikTok Connection
          </h1>
          <p className="text-lg text-black mb-6">Loading TikTok callback...</p>
        </div>
      </div>
    </div>
  );
}

// Main component with Suspense boundary
export default function TikTokCallbackPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <TikTokCallbackContent />
    </Suspense>
  );
}
