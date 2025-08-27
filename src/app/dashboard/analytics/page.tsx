"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  BarChart3,
  TrendingUp,
  Users,
  MessageSquare,
  Camera,
} from "lucide-react";
import AnalyticsDashboard from "@/components/analytics/AnalyticsDashboard";
import TweetAnalytics from "@/components/analytics/TweetAnalytics";
import InstagramAnalyticsDashboard from "@/components/analytics/InstagramAnalyticsDashboard";
import InstagramPostAnalytics from "@/components/analytics/InstagramPostAnalytics";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

export default function AnalyticsPage() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<
    "overview" | "tweets" | "instagram-overview" | "instagram-posts"
  >("overview");

  // Handle URL parameter for tab selection
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (
      tabParam &&
      ["overview", "tweets", "instagram-overview", "instagram-posts"].includes(
        tabParam
      )
    ) {
      setActiveTab(
        tabParam as
          | "overview"
          | "tweets"
          | "instagram-overview"
          | "instagram-posts"
      );
    }
  }, [searchParams]);

  const tabs = [
    {
      id: "overview",
      name: "Twitter Overview",
      icon: <BarChart3 className="w-4 h-4" />,
      description: "Twitter user analytics and performance metrics",
    },
    {
      id: "tweets",
      name: "Tweet Analytics",
      icon: <MessageSquare className="w-4 h-4" />,
      description: "Analyze specific tweets",
    },
    {
      id: "instagram-overview",
      name: "Instagram Overview",
      icon: <Camera className="w-4 h-4" />,
      description: "Instagram user analytics and performance metrics",
    },
    {
      id: "instagram-posts",
      name: "Instagram Post Analytics",
      icon: <Camera className="w-4 h-4" />,
      description: "Analyze specific Instagram posts",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
        <p className="text-gray-600">
          View detailed analytics and performance metrics for your social media
          accounts.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-lg">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() =>
                  setActiveTab(
                    tab.id as
                      | "overview"
                      | "tweets"
                      | "instagram-overview"
                      | "instagram-posts"
                  )
                }
                className={`
                    flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm
                    ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
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
                  Twitter Overview Analytics
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Get comprehensive analytics for your Twitter account including
                  total metrics and engagement rates.
                </p>
                <AnalyticsDashboard />
              </div>
            </ErrorBoundary>
          )}

          {activeTab === "tweets" && (
            <ErrorBoundary>
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-2">
                  Tweet Analytics
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Analyze performance metrics for specific tweets by entering
                  their IDs.
                </p>
                <TweetAnalytics />
              </div>
            </ErrorBoundary>
          )}

          {activeTab === "instagram-overview" && (
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

          {activeTab === "instagram-posts" && (
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
        </div>
      </div>
    </div>
  );
}
