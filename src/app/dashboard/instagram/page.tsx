"use client";

import React, { useState } from "react";
import {
  Camera,
  BarChart3,
  MessageSquare,
  Link,
  AlertCircle,
  CheckCircle,
  RefreshCw,
} from "lucide-react";
import InstagramAnalyticsDashboard from "@/components/analytics/InstagramAnalyticsDashboard";
import InstagramPostAnalytics from "@/components/analytics/InstagramPostAnalytics";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

export default function InstagramPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "posts" | "connect">(
    "overview"
  );
  const [isConnected, setIsConnected] = useState(false); // This would be fetched from your auth state

  const tabs = [
    {
      id: "overview",
      name: "Overview Analytics",
      icon: <BarChart3 className="w-4 h-4" />,
      description: "Instagram user analytics and performance metrics",
    },
    {
      id: "posts",
      name: "Post Analytics",
      icon: <MessageSquare className="w-4 h-4" />,
      description: "Analyze specific Instagram posts",
    },
    {
      id: "connect",
      name: "Connect Account",
      icon: <Link className="w-4 h-4" />,
      description: "Connect your Instagram account",
    },
  ];

  const handleConnectInstagram = async () => {
    try {
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
        console.error("Failed to get Instagram auth URL");
      }
    } catch (error) {
      console.error("Error connecting Instagram:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Instagram</h1>
            <p className="text-gray-600">
              Manage your Instagram account, view analytics, and track
              performance.
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

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-lg">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() =>
                  setActiveTab(tab.id as "overview" | "posts" | "connect")
                }
                className={`
                    flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm
                    ${
                      activeTab === tab.id
                        ? "border-pink-500 text-pink-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }
                  `}
              >
                {tab.icon}
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "overview" && (
            <ErrorBoundary>
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-2">
                  Instagram Overview Analytics
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Get comprehensive analytics for your Instagram account
                  including total metrics and engagement rates.
                </p>
                <InstagramAnalyticsDashboard />
              </div>
            </ErrorBoundary>
          )}

          {activeTab === "posts" && (
            <ErrorBoundary>
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-2">
                  Instagram Post Analytics
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Analyze performance metrics for specific Instagram posts by
                  entering their IDs.
                </p>
                <InstagramPostAnalytics />
              </div>
            </ErrorBoundary>
          )}

          {activeTab === "connect" && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-2">
                Connect Instagram Account
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Connect your Instagram account to access analytics and manage
                your content.
              </p>

              {isConnected ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center">
                    <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                    <div>
                      <h3 className="text-lg font-medium text-green-800">
                        Instagram Account Connected
                      </h3>
                      <p className="text-green-700 mt-1">
                        Your Instagram account is successfully connected. You
                        can now view analytics and manage your content.
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={() => setActiveTab("overview")}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      View Analytics
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                  <div className="flex items-center">
                    <AlertCircle className="w-6 h-6 text-orange-600 mr-3" />
                    <div>
                      <h3 className="text-lg font-medium text-orange-800">
                        Instagram Account Not Connected
                      </h3>
                      <p className="text-orange-700 mt-1">
                        Connect your Instagram account to access analytics and
                        manage your content.
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={handleConnectInstagram}
                      className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors flex items-center"
                    >
                      <Camera className="w-5 h-5 mr-2" />
                      Connect Instagram Account
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
