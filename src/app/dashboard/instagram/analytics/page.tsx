"use client";

import React, { useState, useEffect } from "react";
import { Camera, AlertCircle, CheckCircle } from "lucide-react";
import InstagramAnalyticsDashboard from "@/components/analytics/InstagramAnalyticsDashboard";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

export default function InstagramAnalyticsPage() {
  const [isConnected, setIsConnected] = useState(false);

  // Check connection status on component mount
  useEffect(() => {
    // Check if user has Instagram access token (this would be stored in your auth system)
    // For now, we'll simulate checking connection status
    const hasInstagramToken = false; // Replace with actual token check
    setIsConnected(hasInstagramToken);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Instagram Analytics
            </h1>
            <p className="text-gray-600">
              View detailed analytics and performance metrics for your Instagram
              account.
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

      {/* Connection Status */}
      {!isConnected && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <div className="flex items-center">
            <AlertCircle className="w-6 h-6 text-orange-600 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-orange-800">
                Instagram Account Not Connected
              </h3>
              <p className="text-orange-700 mt-1">
                Connect your Instagram account to view analytics and performance
                metrics.
              </p>
            </div>
          </div>
          <div className="mt-4">
            <a
              href="/dashboard/instagram/profile"
              className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors inline-flex items-center"
            >
              <Camera className="w-5 h-5 mr-2" />
              Connect Instagram Account
            </a>
          </div>
        </div>
      )}

      {/* Analytics Dashboard */}
      {isConnected && (
        <ErrorBoundary>
          <InstagramAnalyticsDashboard />
        </ErrorBoundary>
      )}
    </div>
  );
}
