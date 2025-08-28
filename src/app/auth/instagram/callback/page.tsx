"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/lib/auth";
import { instagramAPI } from "@/lib/api";
import { Loader2, CheckCircle, XCircle, Camera } from "lucide-react";
import toast from "react-hot-toast";

function InstagramCallbackContent() {
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
        const state = searchParams.get("state");
        const error = searchParams.get("error");
        const errorDescription = searchParams.get("error_description");

        // Check for OAuth errors
        if (error) {
          throw new Error(
            errorDescription || `Instagram OAuth error: ${error}`
          );
        }

        if (!code || !state) {
          throw new Error("Missing authorization code or state parameter");
        }

        if (!user) {
          throw new Error("User not authenticated. Please login first.");
        }

        // Verify state parameter
        const storedState = localStorage.getItem("instagram_oauth_state");
        const storedTimestamp = localStorage.getItem(
          "instagram_oauth_timestamp"
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

        setMessage("Processing Instagram connection...");

        // Process the callback
        const response = await instagramAPI.handleOAuthCallback({
          code,
          state,
          userId: user.id.toString(),
        });

        if (response.success) {
          setStatus("success");
          setMessage("Instagram account connected successfully!");
          toast.success("Instagram account connected!");

          // Clean up localStorage
          localStorage.removeItem("instagram_oauth_state");
          localStorage.removeItem("instagram_oauth_timestamp");

          // Redirect to Instagram dashboard after 2 seconds
          setTimeout(() => {
            router.push("/dashboard/instagram");
          }, 2000);
        } else {
          throw new Error(
            response.message || "Failed to connect Instagram account"
          );
        }
      } catch (error: any) {
        console.error("Instagram callback error:", error);
        setStatus("error");
        setMessage(error.message || "Failed to connect Instagram account");
        toast.error(error.message || "Failed to connect Instagram account");

        // Clean up localStorage on error
        localStorage.removeItem("instagram_oauth_state");
        localStorage.removeItem("instagram_oauth_timestamp");

        // Redirect to Instagram dashboard after 3 seconds
        setTimeout(() => {
          router.push("/dashboard/instagram");
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
        return <Loader2 className="h-16 w-16 text-pink-500 animate-spin" />;
      case "success":
        return <CheckCircle className="h-16 w-16 text-green-500" />;
      case "error":
        return <XCircle className="h-16 w-16 text-red-500" />;
      default:
        return <Camera className="h-16 w-16 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "loading":
        return "text-pink-600";
      case "success":
        return "text-green-600";
      case "error":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">{getStatusIcon()}</div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Instagram Connection
          </h1>

          <p className={`text-lg ${getStatusColor()} mb-6`}>{message}</p>

          {status === "loading" && (
            <div className="space-y-2">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-600">
                  Please wait while we connect your Instagram account...
                </p>
              </div>
            </div>
          )}

          {status === "success" && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-700">
                  ✅ Your Instagram account has been successfully connected!
                </p>
              </div>
              <p className="text-sm text-gray-600">
                Redirecting you to the Instagram dashboard...
              </p>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-700">
                  ❌ There was an error connecting your Instagram account.
                </p>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => router.push("/dashboard/instagram")}
                  className="w-full bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700 transition-colors"
                >
                  Go to Instagram Dashboard
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Loader2 className="h-16 w-16 text-pink-500 animate-spin" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Instagram Connection
          </h1>
          <p className="text-lg text-pink-600 mb-6">
            Loading Instagram callback...
          </p>
        </div>
      </div>
    </div>
  );
}

// Main component with Suspense boundary
export default function InstagramCallbackPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <InstagramCallbackContent />
    </Suspense>
  );
}
