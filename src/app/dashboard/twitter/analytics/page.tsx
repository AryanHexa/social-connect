"use client";

import React, { useState, useEffect } from "react";
import { LogOut } from "lucide-react";
import AnalyticsDashboard from "@/components/analytics/AnalyticsDashboard";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import { xAPI } from "@/lib/api";
import toast from "react-hot-toast";

export default function TwitterAnalyticsPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogoutTwitter = async () => {
    try {
      setIsLoading(true);
      const result = await xAPI.logout();

      if (result.success) {
        toast.success("Successfully logged out from Twitter");
      } else {
        toast.error("Failed to logout from Twitter");
      }
    } catch (error) {
      console.error("Error logging out from Twitter:", error);
      toast.error("Failed to logout from Twitter");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Twitter Analytics
            </h1>
            <p className="text-gray-600">
              View detailed analytics and performance metrics for your Twitter
              account.
            </p>
          </div>
          <button
            onClick={handleLogoutTwitter}
            disabled={isLoading}
            className="flex items-center space-x-2 text-red-600 hover:text-red-700 disabled:opacity-50"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Analytics Dashboard */}
      <ErrorBoundary>
        <AnalyticsDashboard />
      </ErrorBoundary>
    </div>
  );
}
