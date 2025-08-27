"use client";

import React, { useState } from "react";
import {
  BarChart3,
  Eye,
  Heart,
  Repeat,
  MessageCircle,
  Quote,
  MousePointer,
  Link,
  Maximize,
  AlertCircle,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import { xAPI } from "@/lib/api";
import { TweetAnalyticsResponse } from "@/lib/types/analytics";
import {
  handleApiError,
  isAuthError,
  isRateLimitError,
  isNetworkError,
} from "@/lib/utils/errorHandler";
import toast from "react-hot-toast";

interface TweetAnalyticsProps {
  twitterAccessToken?: string;
}

export default function TweetAnalytics({
  twitterAccessToken,
}: TweetAnalyticsProps) {
  const [tweetIds, setTweetIds] = useState<string>("");
  const [analytics, setAnalytics] = useState<TweetAnalyticsResponse | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  const fetchTweetAnalytics = async () => {
    try {
      // Validate input
      if (!tweetIds.trim()) {
        toast.error("Please enter at least one tweet ID");
        return;
      }

      const tweetIdsArray = tweetIds
        .split(",")
        .map((id) => id.trim())
        .filter((id) => id);

      if (tweetIdsArray.length === 0) {
        toast.error("Please enter valid tweet IDs");
        return;
      }

      if (tweetIdsArray.length > 100) {
        toast.error("Maximum 100 tweet IDs allowed per request");
        return;
      }

      // Validate tweet ID format
      const invalidTweetIds = tweetIdsArray.filter((id) => !/^\d+$/.test(id));
      if (invalidTweetIds.length > 0) {
        toast.error(
          `Invalid tweet ID format: ${invalidTweetIds.join(
            ", "
          )}. Tweet IDs must be numeric.`
        );
        return;
      }

      setLoading(true);
      setError(null);

      const params: any = {
        tweet_ids: tweetIdsArray.join(","),
      };
      if (dateRange.startDate) params.start_date = dateRange.startDate;
      if (dateRange.endDate) params.end_date = dateRange.endDate;

      const data = await xAPI.getTweetAnalytics(params, twitterAccessToken);
      setAnalytics(data);
      toast.success(`Analytics loaded for ${data.result_count} tweets`);
    } catch (err: any) {
      console.error("Error fetching tweet analytics:", err);
      const apiError = handleApiError(err);
      setError(apiError.message);

      // Show appropriate toast message based on error type
      if (isAuthError(err)) {
        toast.error(
          "Authentication error. Please reconnect your Twitter account."
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

  const getTweetCard = (tweet: any) => (
    <div key={tweet.tweet_id} className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <h3 className="text-lg font-semibold text-gray-900">
            Tweet {tweet.tweet_id}
          </h3>
          <a
            href={`https://twitter.com/i/status/${tweet.tweet_id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 text-blue-600 hover:text-blue-800 text-sm"
          >
            View on Twitter
          </a>
        </div>
        <span className="text-sm text-gray-500">
          {new Date(tweet.created_at).toLocaleDateString()}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Eye className="w-4 h-4 text-blue-500 mr-1" />
          </div>
          <p className="text-sm text-gray-600">Impressions</p>
          <p className="text-lg font-semibold">
            {formatNumber(tweet.impressions)}
          </p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Heart className="w-4 h-4 text-red-500 mr-1" />
          </div>
          <p className="text-sm text-gray-600">Likes</p>
          <p className="text-lg font-semibold">{formatNumber(tweet.likes)}</p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Repeat className="w-4 h-4 text-green-500 mr-1" />
          </div>
          <p className="text-sm text-gray-600">Retweets</p>
          <p className="text-lg font-semibold">
            {formatNumber(tweet.retweets)}
          </p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <MessageCircle className="w-4 h-4 text-purple-500 mr-1" />
          </div>
          <p className="text-sm text-gray-600">Replies</p>
          <p className="text-lg font-semibold">{formatNumber(tweet.replies)}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Quote className="w-4 h-4 text-indigo-500 mr-1" />
          </div>
          <p className="text-sm text-gray-600">Quotes</p>
          <p className="text-lg font-semibold">{formatNumber(tweet.quotes)}</p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <MousePointer className="w-4 h-4 text-pink-500 mr-1" />
          </div>
          <p className="text-sm text-gray-600">Profile Clicks</p>
          <p className="text-lg font-semibold">
            {formatNumber(tweet.profile_clicks)}
          </p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Link className="w-4 h-4 text-orange-500 mr-1" />
          </div>
          <p className="text-sm text-gray-600">URL Clicks</p>
          <p className="text-lg font-semibold">
            {formatNumber(tweet.url_clicks)}
          </p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Maximize className="w-4 h-4 text-teal-500 mr-1" />
          </div>
          <p className="text-sm text-gray-600">Detail Expands</p>
          <p className="text-lg font-semibold">
            {formatNumber(tweet.detail_expands)}
          </p>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Engagement Rate</span>
          <span className="text-lg font-semibold text-green-600">
            {formatPercentage(tweet.engagement_rate)}
          </span>
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
              Tweet Analytics
            </h1>
            <p className="text-gray-600">
              Analyze performance metrics for specific tweets by entering their
              IDs.
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
              onClick={fetchTweetAnalytics}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
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
        <h2 className="text-xl font-bold text-gray-900 mb-4">Tweet Analysis</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tweet IDs (comma-separated, max 100)
            </label>
            <div className="flex items-center space-x-2">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={tweetIds}
                onChange={(e) => setTweetIds(e.target.value)}
                placeholder="e.g., 1234567890, 9876543210"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Enter numeric tweet IDs separated by commas. You can find tweet
              IDs in the URL when viewing a tweet.
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
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                {analytics.result_count} tweets analyzed
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              Period: {new Date(analytics.period_start).toLocaleDateString()} -{" "}
              {new Date(analytics.period_end).toLocaleDateString()}
            </div>
          </div>

          {/* Individual Tweet Analytics */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Individual Tweet Analytics
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {analytics.data.map(getTweetCard)}
            </div>
          </div>
        </>
      )}

      {/* Empty State */}
      {!analytics && !loading && !error && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Analytics Data
            </h3>
            <p className="text-gray-500 mb-4">
              Enter tweet IDs above to analyze their performance metrics.
            </p>
            <div className="text-sm text-gray-400">
              <p>• Enter numeric tweet IDs separated by commas</p>
              <p>• Maximum 100 tweets per analysis</p>
              <p>• Optional date range for filtering</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
