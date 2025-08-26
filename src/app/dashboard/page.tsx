"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/lib/auth";
import { xAPI } from "@/lib/api";
import {
  Twitter,
  Users,
  MessageSquare,
  TrendingUp,
  Sparkles,
  Plus,
  RefreshCw,
} from "lucide-react";
import OAuthTest from "@/components/debug/OAuthTest";

interface DashboardStats {
  totalUsers: number;
  totalPosts: number;
  connectedAccounts: number;
  generatedContent: number;
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalPosts: 0,
    connectedAccounts: 0,
    generatedContent: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    setIsLoading(true);
    try {
      // Don't automatically fetch user data - only show basic stats
      setStats({
        totalUsers: 0,
        totalPosts: 0,
        connectedAccounts: 0,
        generatedContent: 0,
      });
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    {
      title: "Connect Twitter",
      description: "Link your Twitter account",
      icon: Twitter,
      href: "/dashboard/twitter/profile",
      color: "bg-blue-500",
    },
    {
      title: "Generate Content",
      description: "Create AI-powered posts",
      icon: Sparkles,
      href: "/dashboard/content",
      color: "bg-purple-500",
    },
    {
      title: "View Posts",
      description: "See your Twitter posts",
      icon: MessageSquare,
      href: "/dashboard/twitter/posts",
      color: "bg-green-500",
    },
    {
      title: "Analytics",
      description: "View performance metrics",
      icon: TrendingUp,
      href: "/dashboard/analytics",
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.username || user?.email}!
        </h1>
        <p className="text-gray-600">
          Manage your social media presence and generate engaging content with
          AI.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Connected Users
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {isLoading ? "..." : stats.totalUsers}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <MessageSquare className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Posts</p>
              <p className="text-2xl font-bold text-gray-900">
                {isLoading ? "..." : stats.totalPosts}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <Twitter className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Connected Accounts
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {isLoading ? "..." : stats.connectedAccounts}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100">
              <Sparkles className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Generated Content
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {isLoading ? "..." : stats.generatedContent}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
          <button
            onClick={fetchDashboardStats}
            disabled={isLoading}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            />
            <span>Refresh</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <a
              key={action.title}
              href={action.href}
              className="block p-6 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center mb-4">
                <div
                  className={`p-3 rounded-full ${action.color} bg-opacity-10`}
                >
                  <action.icon
                    className={`w-6 h-6 ${action.color.replace(
                      "bg-",
                      "text-"
                    )}`}
                  />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {action.title}
              </h3>
              <p className="text-gray-600 text-sm">{action.description}</p>
            </a>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Recent Activity
        </h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="p-2 rounded-full bg-blue-100">
              <Plus className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                Welcome to SocialEdge!
              </p>
              <p className="text-sm text-gray-600">
                Get started by connecting your Twitter account
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* OAuth Debug Component - Remove this after fixing the issue */}
      <OAuthTest />
    </div>
  );
}
