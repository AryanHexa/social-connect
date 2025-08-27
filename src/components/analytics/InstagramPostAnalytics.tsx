"use client";

import React, { useState } from "react";
import {
  BarChart3,
  Eye,
  Heart,
  MessageCircle,
  Share,
  Bookmark,
  MousePointer,
  Link,
  AlertCircle,
  RefreshCw,
  Search,
  X,
  Camera,
} from "lucide-react";
import { xAPI } from "@/lib/api";
import { InstagramPostAnalyticsResponse } from "@/lib/types/instagram-analytics";
import {
  handleApiError,
  isAuthError,
  isRateLimitError,
  isNetworkError,
} from "@/lib/utils/errorHandler";
import toast from "react-hot-toast";

interface InstagramPostAnalyticsProps {
  instagramAccessToken?: string;
}

export default function InstagramPostAnalytics({
  instagramAccessToken,
}: InstagramPostAnalyticsProps) {
  const [postIds, setPostIds] = useState<string>("");
  const [analytics, setAnalytics] =
    useState<InstagramPostAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  const fetchPostAnalytics = async () => {
    try {
      // Validate input
      if (!postIds.trim()) {
        toast.error("Please enter at least one post ID");
        return;
      }

      const postIdsArray = postIds
        .split(",")
        .map((id) => id.trim())
        .filter((id) => id);

      if (postIdsArray.length === 0) {
        toast.error("Please enter valid post IDs");
        return;
      }

      if (postIdsArray.length > 100) {
        toast.error("Maximum 100 post IDs allowed per request");
        return;
      }

      setLoading(true);
      setError(null);

      const params: any = {
        post_ids: postIdsArray.join(","),
      };
      if (dateRange.startDate) params.start_date = dateRange.startDate;
      if (dateRange.endDate) params.end_date = dateRange.endDate;

      // const data = await xAPI.getInstagramPostAnalytics(
      //   params,
      //   instagramAccessToken
      // );
      // setAnalytics(data);
      // toast.success(`Analytics loaded for ${data.result_count} posts`);
    } catch (err: any) {
      console.error("Error fetching Instagram post analytics:", err);
      const apiError = handleApiError(err);
      setError(apiError.message);

      // Show appropriate toast message based on error type
      if (isAuthError(err)) {
        toast.error(
          "Authentication error. Please reconnect your Instagram account."
        );
      } else if (isRateLimitError(err)) {
        toast.error("Rate limit exceeded. Please try again later.");
      } else if (isNetworkError(err)) {
        toast.error(
          "Network error. Please check your connection and try again."
        );
      } else {
        toast.error(apiError.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (
    field: "startDate" | "endDate",
    value: string
  ) => {
    setDateRange((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const clearAnalytics = () => {
    setAnalytics(null);
    setError(null);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const formatPercentage = (num: number): string => {
    return num.toFixed(2) + "%";
  };

  const getMetricCard = (
    title: string,
    value: number,
    icon: React.ReactNode,
    color: string,
    formatter: (num: number) => string = formatNumber
  ) => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`p-3 rounded-full ${color}`}>{icon}</div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatter(value)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const getPostCard = (post: any) => (
    <div key={post.post_id} className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <h3 className="text-lg font-semibold text-gray-900">
            Post {post.post_id}
          </h3>
          <a
            href={`https://www.instagram.com/p/${post.post_id}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 text-pink-600 hover:text-pink-800 text-sm"
          >
            View on Instagram
          </a>
        </div>
        <span className="text-sm text-gray-500">
          {new Date(post.created_at).toLocaleDateString()}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Eye className="w-4 h-4 text-blue-500 mr-1" />
          </div>
          <p className="text-sm text-gray-600">Impressions</p>
          <p className="text-lg font-semibold">
            {formatNumber(post.impressions)}
          </p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Heart className="w-4 h-4 text-red-500 mr-1" />
          </div>
          <p className="text-sm text-gray-600">Likes</p>
          <p className="text-lg font-semibold">{formatNumber(post.likes)}</p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <MessageCircle className="w-4 h-4 text-green-500 mr-1" />
          </div>
          <p className="text-sm text-gray-600">Comments</p>
          <p className="text-lg font-semibold">{formatNumber(post.comments)}</p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Share className="w-4 h-4 text-purple-500 mr-1" />
          </div>
          <p className="text-sm text-gray-600">Shares</p>
          <p className="text-lg font-semibold">{formatNumber(post.shares)}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Bookmark className="w-4 h-4 text-indigo-500 mr-1" />
          </div>
          <p className="text-sm text-gray-600">Saves</p>
          <p className="text-lg font-semibold">{formatNumber(post.saves)}</p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <MousePointer className="w-4 h-4 text-pink-500 mr-1" />
          </div>
          <p className="text-sm text-gray-600">Profile Visits</p>
          <p className="text-lg font-semibold">
            {formatNumber(post.profile_visits)}
          </p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Link className="w-4 h-4 text-orange-500 mr-1" />
          </div>
          <p className="text-sm text-gray-600">Website Clicks</p>
          <p className="text-lg font-semibold">
            {formatNumber(post.website_clicks)}
          </p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <BarChart3 className="w-4 h-4 text-teal-500 mr-1" />
          </div>
          <p className="text-sm text-gray-600">Engagement Rate</p>
          <p className="text-lg font-semibold text-green-600">
            {formatPercentage(post.engagement_rate)}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Instagram Post Analytics
            </h1>
            <p className="text-gray-600">
              Analyze performance metrics for specific Instagram posts by
              entering their IDs.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {analytics && (
              <button
                onClick={clearAnalytics}
                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                <X className="w-4 h-4 mr-2" />
                Clear
              </button>
            )}
            <button
              onClick={fetchPostAnalytics}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              {loading ? "Loading..." : "Analyze"}
            </button>
          </div>
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Post Analysis</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Post IDs (comma-separated, max 100)
            </label>
            <div className="flex items-center space-x-2">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={postIds}
                onChange={(e) => setPostIds(e.target.value)}
                placeholder="e.g., ABC123, DEF456"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Enter Instagram post IDs separated by commas. You can find post
              IDs in the URL when viewing a post.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date (Optional)
              </label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) =>
                  handleDateRangeChange("startDate", e.target.value)
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date (Optional)
              </label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) =>
                  handleDateRangeChange("endDate", e.target.value)
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-red-800">
                Error Loading Analytics
              </h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Results */}
      {analytics && (
        <>
          {/* Summary Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {getMetricCard(
              "Total Impressions",
              analytics.summary.impressions,
              <Eye className="w-6 h-6 text-blue-600" />,
              "bg-blue-100"
            )}
            {getMetricCard(
              "Total Engagement",
              analytics.summary.total_engagement,
              <BarChart3 className="w-6 h-6 text-green-600" />,
              "bg-green-100"
            )}
            {getMetricCard(
              "Total Likes",
              analytics.summary.likes,
              <Heart className="w-6 h-6 text-red-600" />,
              "bg-red-100"
            )}
            {getMetricCard(
              "Avg Engagement Rate",
              analytics.summary.engagement_rate,
              <BarChart3 className="w-6 h-6 text-orange-600" />,
              "bg-orange-100",
              formatPercentage
            )}
          </div>

          {/* Period Information */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <BarChart3 className="w-5 h-5 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">Analysis Summary:</span>
              </div>
              <div className="text-sm text-gray-900">
                {analytics.result_count} posts analyzed
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              Period: {new Date(analytics.period_start).toLocaleDateString()} -{" "}
              {new Date(analytics.period_end).toLocaleDateString()}
            </div>
          </div>

          {/* Individual Post Analytics */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Individual Post Analytics
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {analytics.data.map(getPostCard)}
            </div>
          </div>
        </>
      )}

      {/* Empty State */}
      {!analytics && !loading && !error && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-center py-12">
            <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Analytics Data
            </h3>
            <p className="text-gray-500 mb-4">
              Enter post IDs above to analyze their performance metrics.
            </p>
            <div className="text-sm text-gray-400">
              <p>• Enter Instagram post IDs separated by commas</p>
              <p>• Maximum 100 posts per analysis</p>
              <p>• Optional date range for filtering</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
