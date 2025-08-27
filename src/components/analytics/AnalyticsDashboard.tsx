"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  MessageSquare,
  Eye,
  Heart,
  Repeat,
  MessageCircle,
  Quote,
  MousePointer,
  Link,
  Maximize,
  Calendar,
  AlertCircle,
  RefreshCw,
  Download,
} from "lucide-react";
import { xAPI } from "@/lib/api";
import {
  UserAnalyticsResponse,
  TweetAnalyticsResponse,
  AnalyticsError,
} from "@/lib/types/analytics";
import {
  handleApiError,
  isAuthError,
  isRateLimitError,
  isNetworkError,
} from "@/lib/utils/errorHandler";
import toast from "react-hot-toast";

interface AnalyticsDashboardProps {
  twitterAccessToken?: string;
}

export default function AnalyticsDashboard({
  twitterAccessToken,
}: AnalyticsDashboardProps) {
  const [userAnalytics, setUserAnalytics] =
    useState<UserAnalyticsResponse | null>(null);
  const [tweetAnalytics, setTweetAnalytics] =
    useState<TweetAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  const fetchUserAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: any = {};
      if (dateRange.startDate) params.start_date = dateRange.startDate;
      if (dateRange.endDate) params.end_date = dateRange.endDate;

      const data = await xAPI.getUserAnalytics(params, twitterAccessToken);
      setUserAnalytics(data);
      toast.success("User analytics loaded successfully");
    } catch (err: any) {
      console.error("Error fetching user analytics:", err);
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

  const fetchTweetAnalytics = async (tweetIds: string[]) => {
    try {
      setLoading(true);
      setError(null);

      const params: any = {
        tweet_ids: tweetIds.join(","),
      };
      if (dateRange.startDate) params.start_date = dateRange.startDate;
      if (dateRange.endDate) params.end_date = dateRange.endDate;

      const data = await xAPI.getTweetAnalytics(params, twitterAccessToken);
      setTweetAnalytics(data);
      toast.success("Tweet analytics loaded successfully");
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

  const handleRefresh = () => {
    fetchUserAnalytics();
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

  const getTweetAnalyticsCard = (tweet: any) => (
    <div key={tweet.tweet_id} className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Tweet {tweet.tweet_id}
        </h3>
        <span className="text-sm text-gray-500">
          {new Date(tweet.created_at).toLocaleDateString()}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

      <div className="mt-4 pt-4 border-t border-gray-200">
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
              Analytics Dashboard
            </h1>
            <p className="text-gray-600">
              View detailed analytics and performance metrics for your Twitter
              account.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Date Range</h2>
        <div className="flex items-center space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) =>
                handleDateRangeChange("startDate", e.target.value)
              }
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => handleDateRangeChange("endDate", e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={fetchUserAnalytics}
            disabled={loading}
            className="mt-6 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Load Analytics"}
          </button>
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

      {/* User Analytics Summary */}
      {userAnalytics && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {getMetricCard(
              "Total Impressions",
              userAnalytics.data.total_impressions,
              <Eye className="w-6 h-6 text-blue-600" />,
              "bg-blue-100"
            )}
            {getMetricCard(
              "Total Engagement",
              userAnalytics.summary.total_engagement,
              <TrendingUp className="w-6 h-6 text-green-600" />,
              "bg-green-100"
            )}
            {getMetricCard(
              "Total Followers",
              userAnalytics.data.total_impressions, // Placeholder - would need user data
              <Users className="w-6 h-6 text-purple-600" />,
              "bg-purple-100"
            )}
            {getMetricCard(
              "Avg Engagement Rate",
              userAnalytics.data.avg_engagement_rate,
              <BarChart3 className="w-6 h-6 text-orange-600" />,
              "bg-orange-100",
              formatPercentage
            )}
          </div>

          {/* Detailed Metrics */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Detailed Metrics
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {getMetricCard(
                "Likes",
                userAnalytics.data.total_likes,
                <Heart className="w-6 h-6 text-red-600" />,
                "bg-red-100"
              )}
              {getMetricCard(
                "Retweets",
                userAnalytics.data.total_retweets,
                <Repeat className="w-6 h-6 text-green-600" />,
                "bg-green-100"
              )}
              {getMetricCard(
                "Replies",
                userAnalytics.data.total_replies,
                <MessageCircle className="w-6 h-6 text-blue-600" />,
                "bg-blue-100"
              )}
              {getMetricCard(
                "Quotes",
                userAnalytics.data.total_quotes,
                <Quote className="w-6 h-6 text-purple-600" />,
                "bg-purple-100"
              )}
              {getMetricCard(
                "Profile Clicks",
                userAnalytics.data.total_profile_clicks,
                <MousePointer className="w-6 h-6 text-indigo-600" />,
                "bg-indigo-100"
              )}
              {getMetricCard(
                "URL Clicks",
                userAnalytics.data.total_url_clicks,
                <Link className="w-6 h-6 text-pink-600" />,
                "bg-pink-100"
              )}
            </div>
          </div>

          {/* Period Information */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">Analysis Period:</span>
              </div>
              <div className="text-sm text-gray-900">
                {new Date(userAnalytics.data.period_start).toLocaleDateString()}{" "}
                - {new Date(userAnalytics.data.period_end).toLocaleDateString()}
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              Total tweets analyzed: {userAnalytics.data.total_tweets}
            </div>
          </div>
        </>
      )}

      {/* Tweet Analytics */}
      {tweetAnalytics && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Tweet-Level Analytics
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {tweetAnalytics.data.map(getTweetAnalyticsCard)}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!userAnalytics && !loading && !error && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Analytics Data
            </h3>
            <p className="text-gray-500 mb-4">
              Connect your Twitter account and load analytics to see detailed
              performance metrics.
            </p>
            <button
              onClick={fetchUserAnalytics}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Load Analytics
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
