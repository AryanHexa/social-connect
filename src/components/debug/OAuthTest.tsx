"use client";

import { useState } from "react";
import { xAPI } from "@/lib/api";

export default function OAuthTest() {
  const [isLoading, setIsLoading] = useState(false);

  const testOAuthConfig = () => {
    console.log("=== OAuth Configuration Test ===");
    console.log(
      "API Base URL:",
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1"
    );
    console.log("Current URL:", window.location.href);
    console.log("URL Params:", window.location.search);
  };

  const testOAuthFlow = async () => {
    setIsLoading(true);
    try {
      console.log("=== Starting Backend OAuth Flow Test ===");

      // Step 1: Generate OAuth URL from backend
      console.log("Step 1: Generating OAuth URL from backend...");
      const authUrlResult = await xAPI.generateAuthUrl();
      console.log("Auth URL Result:", authUrlResult);

      if (authUrlResult.authUrl) {
        console.log("Step 2: Redirecting to Twitter OAuth...");
        console.log("Auth URL:", authUrlResult.authUrl);
        window.location.href = authUrlResult.authUrl;
      } else {
        console.error("Failed to get auth URL from backend");
        alert("Failed to get OAuth URL from backend");
      }
    } catch (error: any) {
      console.error("OAuth initiation error:", error);
      alert(`OAuth Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testCallbackHandling = () => {
    console.log("=== Testing Callback Handling ===");
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const state = urlParams.get("state");

    console.log("URL Code:", code);
    console.log("URL State:", state);

    if (code && state) {
      console.log("✅ OAuth callback detected in URL");
    } else {
      console.log("❌ No OAuth callback parameters found");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Backend OAuth Debug Test
      </h2>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Configuration
          </h3>
          <div className="bg-gray-100 p-3 rounded text-sm">
            <p>
              <strong>API Base URL:</strong>{" "}
              {process.env.NEXT_PUBLIC_API_URL ||
                "http://localhost:3000/api/v1"}
            </p>
            <p>
              <strong>Current URL:</strong>{" "}
              {typeof window !== "undefined" ? window.location.href : "N/A"}
            </p>
            <p>
              <strong>URL Params:</strong>{" "}
              {typeof window !== "undefined" ? window.location.search : "N/A"}
            </p>
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={testOAuthConfig}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Test Config
          </button>

          <button
            onClick={testOAuthFlow}
            disabled={isLoading}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {isLoading ? "Starting..." : "Test Backend OAuth Flow"}
          </button>

          <button
            onClick={testCallbackHandling}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
          >
            Test Callback
          </button>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
          <h4 className="font-semibold text-yellow-800 mb-2">
            New Backend OAuth Flow:
          </h4>
          <ol className="text-sm text-yellow-700 space-y-1">
            <li>
              1. Frontend calls <code>/api/v1/x/auth/url</code>
            </li>
            <li>2. Backend generates OAuth URL with state</li>
            <li>3. Frontend redirects to Twitter</li>
            <li>4. Twitter redirects back with code</li>
            <li>
              5. Frontend calls <code>/api/v1/x/auth/callback</code>
            </li>
            <li>6. Backend exchanges code for token and stores it</li>
          </ol>
        </div>

        <div className="bg-green-50 border border-green-200 rounded p-4">
          <h4 className="font-semibold text-green-800 mb-2">
            Debug Instructions:
          </h4>
          <ol className="text-sm text-green-700 space-y-1">
            <li>1. Open browser console (F12)</li>
            <li>2. Click "Test Config" to check settings</li>
            <li>3. Click "Test Backend OAuth Flow" to start OAuth</li>
            <li>4. Check console logs for detailed information</li>
            <li>5. After Twitter redirect, click "Test Callback"</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
