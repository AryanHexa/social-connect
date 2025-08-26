"use client";

import { useState } from "react";
import { authAPI, xAPI, usersAPI } from "@/lib/api";

export default function ApiTest() {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (
    test: string,
    success: boolean,
    data?: any,
    error?: any
  ) => {
    setTestResults((prev) => [
      ...prev,
      {
        test,
        success,
        data,
        error,
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  const testAuthEndpoints = async () => {
    setIsLoading(true);
    setTestResults([]);

    // Test 1: Check if gateway is reachable
    try {
      const response = await fetch("http://localhost:3000/api/v1/health", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      addResult("Gateway Health Check", response.ok, {
        status: response.status,
      });
    } catch (error) {
      addResult("Gateway Health Check", false, null, error);
    }

    // Test 2: Try login endpoint
    try {
      const response = await authAPI.login("test@example.com", "password123");
      addResult("Auth Login", true, response);
    } catch (error: any) {
      addResult("Auth Login", false, null, {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
      });
    }

    // Test 3: Try X API endpoint (only if connected)
    addResult("X API Get User", false, null, {
      message:
        "User API not called automatically - only call after successful connection",
    });

    // Test 4: Try Users API endpoint
    try {
      const response = await usersAPI.getProfile();
      addResult("Users API Get Profile", true, response);
    } catch (error: any) {
      addResult("Users API Get Profile", false, null, {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
      });
    }

    setIsLoading(false);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        API Connection Test
      </h2>

      <div className="mb-6">
        <button
          onClick={testAuthEndpoints}
          disabled={isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 mr-4"
        >
          {isLoading ? "Testing..." : "Test API Endpoints"}
        </button>
        <button
          onClick={clearResults}
          className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
        >
          Clear Results
        </button>
      </div>

      <div className="space-y-4">
        {testResults.map((result, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border ${
              result.success
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900">{result.test}</h3>
              <span
                className={`px-2 py-1 rounded text-sm ${
                  result.success
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {result.success ? "SUCCESS" : "FAILED"}
              </span>
            </div>

            {result.data && (
              <div className="mb-2">
                <p className="text-sm text-gray-600">Response:</p>
                <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </div>
            )}

            {result.error && (
              <div>
                <p className="text-sm text-gray-600">Error:</p>
                <pre className="text-xs bg-red-100 p-2 rounded overflow-auto">
                  {JSON.stringify(result.error, null, 2)}
                </pre>
              </div>
            )}

            <p className="text-xs text-gray-500 mt-2">
              {new Date(result.timestamp).toLocaleTimeString()}
            </p>
          </div>
        ))}
      </div>

      {testResults.length === 0 && !isLoading && (
        <div className="text-center text-gray-500 py-8">
          <p>Click "Test API Endpoints" to check connectivity</p>
        </div>
      )}
    </div>
  );
}
