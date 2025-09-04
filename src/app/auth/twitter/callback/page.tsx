"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/lib/auth";
import { xAPI } from "@/lib/api";
import { Loader2, CheckCircle, XCircle, Twitter } from "lucide-react";
import toast from "react-hot-toast";

function TwitterCallbackContent() {
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
        console.log("Twitter callback params:", {
          code: code ? `${code.substring(0, 20)}...` : null,
          state,
          error,
          errorDescription,
          fullUrl: window.location.href,
          searchParams: Object.fromEntries(searchParams.entries()),
        });

        // Check for OAuth errors
        if (error) {
          throw new Error(errorDescription || `Twitter OAuth error: ${error}`);
        }

        if (!code) {
          throw new Error("Missing authorization code");
        }

        if (!state) {
          console.warn("State parameter missing from Twitter callback");
          // Try to get state from localStorage as fallback
          const storedState = localStorage.getItem("twitter_oauth_state");
          const storedTimestamp = localStorage.getItem(
            "twitter_oauth_timestamp"
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
          const storedState = localStorage.getItem("twitter_oauth_state");
          const storedTimestamp = localStorage.getItem(
            "twitter_oauth_timestamp"
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

        setMessage("Processing Twitter connection...");

        // Process the callback - Updated to match gateway controller structure
        const response = await xAPI.handleOAuthCallback({
          code,
          state,
          userId: user.id.toString(), // Convert to string as expected by gateway
        });

        console.log(
          "***Twitter OAuth Callback Response in page.tsx***",
          response
        );

        if (response.success) {
          setStatus("success");
          setMessage("Twitter account connected successfully!");
          toast.success("Twitter account connected!");

          // Clean up localStorage
          localStorage.removeItem("twitter_oauth_state");
          localStorage.removeItem("twitter_oauth_timestamp");

          // Redirect to Twitter dashboard after 2 seconds
          setTimeout(() => {
            router.push("/dashboard/x");
          }, 2000);

          // store data from response in local storage
          if (response.username) {
            localStorage.setItem(
              "twitter_user",
              JSON.stringify(response.username)
            );
          }
        } else {
          throw new Error(
            response.message || "Failed to connect Twitter account"
          );
        }
      } catch (error: any) {
        console.error("Twitter callback error:", error);
        setStatus("error");
        setMessage(error.message || "Failed to connect Twitter account");
        toast.error(error.message || "Failed to connect Twitter account");

        // Clean up localStorage on error
        localStorage.removeItem("twitter_oauth_state");
        localStorage.removeItem("twitter_oauth_timestamp");

        // Redirect to Twitter dashboard after 3 seconds
        setTimeout(() => {
          router.push("/dashboard/x");
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
        return <Loader2 className="h-16 w-16 text-blue-500 animate-spin" />;
      case "success":
        return <CheckCircle className="h-16 w-16 text-green-500" />;
      case "error":
        return <XCircle className="h-16 w-16 text-red-500" />;
      default:
        return <Twitter className="h-16 w-16 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "loading":
        return "text-blue-600";
      case "success":
        return "text-green-600";
      case "error":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">{getStatusIcon()}</div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Twitter Connection
          </h1>

          <p className={`text-lg ${getStatusColor()} mb-6`}>{message}</p>

          {status === "loading" && (
            <div className="space-y-2">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-600">
                  Please wait while we connect your Twitter account...
                </p>
              </div>
            </div>
          )}

          {status === "success" && (
            <div className="space-y-2">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-600">
                  Your Twitter account has been successfully connected!
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Redirecting to dashboard...
                </p>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-2">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-600">
                  There was an error connecting your Twitter account.
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Redirecting to dashboard...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TwitterCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-16 w-16 text-blue-500 animate-spin mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900">
              Processing Twitter Connection...
            </h1>
          </div>
        </div>
      }
    >
      <TwitterCallbackContent />
    </Suspense>
  );
}
