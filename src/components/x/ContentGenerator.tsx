"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { xAPI } from "@/lib/api";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { Sparkles, Copy, RefreshCw, LogOut } from "lucide-react";

interface ContentFormData {
  platform: string;
  contentType: string;
  hashtags: boolean;
  niche: string;
  ica: string;
  userProfileBio: string;
  trendingTopic: string;
  maxPostsToAnalyze: string;
}

interface GeneratedContent {
  platform: string;
  contentType: string;
  content: string;
  generatedAt: string;
}

export default function ContentGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] =
    useState<GeneratedContent | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContentFormData>({
    defaultValues: {
      platform: "twitter",
      contentType: "post",
      hashtags: true,
      niche: "",
      ica: "",
      userProfileBio: "",
      trendingTopic: "",
      maxPostsToAnalyze: "10",
    },
  });

  const onSubmit = async (data: ContentFormData) => {
    setIsLoading(true);
    try {
      const response = await xAPI.generateContent(data);
      if (response.content) {
        setGeneratedContent(response);
        toast.success("Content generated successfully!");
      } else {
        toast.error(response.message || "Failed to generate content");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to generate content"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (generatedContent) {
      try {
        await navigator.clipboard.writeText(generatedContent.content);
        toast.success("Content copied to clipboard!");
      } catch (error) {
        toast.error("Failed to copy content");
      }
    }
  };

  const regenerateContent = () => {
    setGeneratedContent(null);
  };

  const handleLogoutTwitter = async () => {
    try {
      setIsLoading(true);
      const result = await xAPI.logout();

      if (result.success) {
        setGeneratedContent(null);
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
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Sparkles className="w-8 h-8 text-purple-500 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">
            AI Content Generator
          </h2>
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="platform"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Platform
            </label>
            <select
              {...register("platform")}
              id="platform"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="twitter">Twitter</option>
              <option value="instagram">Instagram</option>
              <option value="linkedin">LinkedIn</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="contentType"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Content Type
            </label>
            <select
              {...register("contentType")}
              id="contentType"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="post">Post</option>
              <option value="thread">Thread</option>
              <option value="story">Story</option>
              <option value="article">Article</option>
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="niche"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Niche/Industry
          </label>
          <input
            {...register("niche")}
            type="text"
            id="niche"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., technology, health, finance, education"
          />
        </div>

        <div>
          <label
            htmlFor="ica"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Ideal Customer Avatar (ICA)
          </label>
          <input
            {...register("ica")}
            type="text"
            id="ica"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., tech-savvy professionals aged 25-40"
          />
        </div>

        <div>
          <label
            htmlFor="userProfileBio"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Your Profile Bio
          </label>
          <textarea
            {...register("userProfileBio")}
            id="userProfileBio"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe your expertise and what you do..."
          />
        </div>

        <div>
          <label
            htmlFor="trendingTopic"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Trending Topic (Optional)
          </label>
          <input
            {...register("trendingTopic")}
            type="text"
            id="trendingTopic"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., AI and machine learning, remote work"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="maxPostsToAnalyze"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Posts to Analyze
            </label>
            <input
              {...register("maxPostsToAnalyze")}
              type="number"
              id="maxPostsToAnalyze"
              min="1"
              max="50"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center">
            <input
              {...register("hashtags")}
              type="checkbox"
              id="hashtags"
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="hashtags" className="ml-2 text-sm text-gray-700">
              Include hashtags
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          {isLoading ? "Generating..." : "Generate Content"}
        </button>
      </form>

      {generatedContent && (
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Generated Content
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={copyToClipboard}
                className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
              >
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </button>
              <button
                onClick={regenerateContent}
                className="flex items-center space-x-1 text-gray-600 hover:text-gray-700"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Regenerate</span>
              </button>
            </div>
          </div>

          <div className="bg-white p-4 rounded border">
            <div className="text-sm text-gray-500 mb-2">
              Generated for {generatedContent.platform} •{" "}
              {generatedContent.contentType} •{" "}
              {new Date(generatedContent.generatedAt).toLocaleString()}
            </div>
            <div className="text-gray-900 whitespace-pre-wrap">
              {generatedContent.content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
