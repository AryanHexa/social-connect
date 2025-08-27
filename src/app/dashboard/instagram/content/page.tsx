"use client";

import React, { useState, useEffect } from "react";
import {
  Camera,
  Zap,
  AlertCircle,
  CheckCircle,
  Sparkles,
  Copy,
  Download,
  Share,
  Image,
  Video,
  FileText,
  LogOut,
} from "lucide-react";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import { instagramAPI } from "@/lib/api";
import toast from "react-hot-toast";

export default function InstagramContentPage() {
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string>("");
  const [contentType, setContentType] = useState<
    "caption" | "hashtags" | "story"
  >("caption");
  const [prompt, setPrompt] = useState("");

  // Check connection status on component mount
  useEffect(() => {
    // Check if user has Instagram access token (this would be stored in your auth system)
    // For now, we'll simulate checking connection status
    const hasInstagramToken = false; // Replace with actual token check
    setIsConnected(hasInstagramToken);
  }, []);

  const handleConnectInstagram = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/auth/instagram/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (data.success && data.data.redirect) {
        window.location.href = data.data.authUrl;
      }
    } catch (error) {
      console.error("Error connecting Instagram:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutInstagram = async () => {
    try {
      setLoading(true);
      const result = await instagramAPI.logout();

      if (result.success) {
        setIsConnected(false);
        setGeneratedContent("");
        toast.success("Successfully logged out from Instagram");
      } else {
        toast.error("Failed to logout from Instagram");
      }
    } catch (error) {
      console.error("Error logging out from Instagram:", error);
      toast.error("Failed to logout from Instagram");
    } finally {
      setLoading(false);
    }
  };

  const generateContent = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    // Mock content generation - replace with actual API call
    setTimeout(() => {
      const mockContent = `✨ ${prompt}\n\n#instagram #content #socialmedia #digitalmarketing #growth #engagement #strategy #marketing #business #success`;
      setGeneratedContent(mockContent);
      setLoading(false);
    }, 2000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Instagram Content Generator
            </h1>
            <p className="text-gray-600">
              Generate engaging Instagram content using AI.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {isConnected ? (
              <>
                <div className="flex items-center text-green-600">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">Connected</span>
                </div>
                <button
                  onClick={handleLogoutInstagram}
                  disabled={loading}
                  className="flex items-center px-3 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {loading ? "Logging out..." : "Logout"}
                </button>
              </>
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
                Connect your Instagram account to generate and post content.
              </p>
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={handleConnectInstagram}
              disabled={loading}
              className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors flex items-center disabled:opacity-50"
            >
              <Camera className="w-5 h-5 mr-2" />
              {loading ? "Connecting..." : "Connect Instagram Account"}
            </button>
          </div>
        </div>
      )}

      {/* Content Generator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Generate Content
          </h2>

          {/* Content Type Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "caption", name: "Caption", icon: FileText },
                { id: "hashtags", name: "Hashtags", icon: Sparkles },
                { id: "story", name: "Story", icon: Image },
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => setContentType(type.id as any)}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    contentType === type.id
                      ? "border-pink-500 bg-pink-50 text-pink-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <type.icon className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-xs">{type.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Prompt Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Describe your content
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what kind of content you want to create..."
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={generateContent}
            disabled={loading || !prompt.trim()}
            className="w-full bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 disabled:opacity-50 flex items-center justify-center"
          >
            <Zap className="w-5 h-5 mr-2" />
            {loading ? "Generating..." : "Generate Content"}
          </button>
        </div>

        {/* Output Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Generated Content
          </h2>

          {generatedContent ? (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="whitespace-pre-wrap text-sm text-gray-900">
                  {generatedContent}
                </pre>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={copyToClipboard}
                  className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 flex items-center justify-center"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </button>
                <button className="flex-1 bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700 flex items-center justify-center">
                  <Share className="w-4 h-4 mr-2" />
                  Post to Instagram
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Sparkles className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>Generated content will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
