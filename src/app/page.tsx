"use client";

import { useState, useEffect } from "react";
import { Instagram, Twitter, Facebook } from "lucide-react";
import { authenticatePlatform, PLATFORM_CONFIGS } from "@/lib/api";

export default function Home() {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Handle OAuth callback parameters
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const success = urlParams.get("success");
      const error = urlParams.get("error");
      const errorDescription = urlParams.get("error_description");
      const platform = urlParams.get("platform");
      const username = urlParams.get("username");

      if (success === "true" && platform) {
        const platformName =
          platform.charAt(0).toUpperCase() + platform.slice(1);
        const userInfo = username ? ` as @${username}` : "";
        setMessage({
          type: "success",
          text: `Successfully connected to ${platformName}${userInfo}!`,
        });
        // Clean up URL parameters
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
      } else if (error) {
        setMessage({
          type: "error",
          text: errorDescription || `Authentication failed: ${error}`,
        });
        // Clean up URL parameters
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
      }
    }
  }, []);

  const handlePlatformConnect = async (platform: string) => {
    setIsLoading(platform);
    setMessage(null);

    try {
      const result = await authenticatePlatform(platform);

      console.log({ result });

      if (result.success) {
        // Check if this is an Instagram redirect
        if (result.data?.authUrl) {
          setMessage({
            type: "success",
            text: "Redirecting to Instagram for authentication...",
          });
          // Redirect to Instagram auth URL
          console.log({ authUrl: result.data.authUrl });
          window.location.href = result.data.authUrl;
        } else {
          setMessage({
            type: "error",
            text: result.message || `Failed to connect to ${platform}!`,
          });
        }
      } else {
        setMessage({
          type: "error",
          text: result.error || `Failed to connect to ${platform}`,
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: `Error connecting to ${platform}: ${error}`,
      });
    } finally {
      setIsLoading(null);
    }
  };

  const platforms = [
    {
      name: "Instagram",
      icon: Instagram,
      color: "bg-gradient-to-r from-purple-500 to-pink-500",
      hoverColor: "hover:from-purple-600 hover:to-pink-600",
      config: PLATFORM_CONFIGS.instagram,
    },
    {
      name: "Twitter",
      icon: Twitter,
      color: "bg-gradient-to-r from-blue-400 to-blue-600",
      hoverColor: "hover:from-blue-500 hover:to-blue-700",
      config: PLATFORM_CONFIGS.twitter,
    },
    {
      name: "Facebook",
      icon: Facebook,
      color: "bg-gradient-to-r from-blue-600 to-blue-800",
      hoverColor: "hover:from-blue-700 hover:to-blue-900",
      config: PLATFORM_CONFIGS.facebook,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Social Edge
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Connect your social media platforms
          </p>
        </div>

        {/* Platform Connect Cards */}
        <div className="space-y-4">
          {platforms.map((platform) => {
            const IconComponent = platform.icon;
            const isPlatformLoading = isLoading === platform.name.toLowerCase();

            return (
              <button
                key={platform.name}
                onClick={() =>
                  handlePlatformConnect(platform.name.toLowerCase())
                }
                disabled={isLoading !== null}
                className={`
                  w-full p-4 rounded-xl shadow-lg transition-all duration-300 transform
                  ${platform.color} ${platform.hoverColor}
                  text-white font-semibold text-lg
                  flex items-center justify-center gap-3
                  ${
                    isPlatformLoading
                      ? "opacity-75 cursor-not-allowed"
                      : "hover:scale-105 hover:shadow-xl"
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                <IconComponent className="w-6 h-6" />
                {isPlatformLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Connecting...
                  </div>
                ) : (
                  `Connect ${platform.name}`
                )}
              </button>
            );
          })}
        </div>

        {/* Message Display */}
        {message && (
          <div
            className={`mt-6 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-100 border border-green-400 text-green-700 dark:bg-green-900 dark:border-green-700 dark:text-green-300"
                : "bg-red-100 border border-red-400 text-red-700 dark:bg-red-900 dark:border-red-700 dark:text-red-300"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Secure authentication powered by Social Edge</p>
        </div>
      </div>
    </div>
  );
}
