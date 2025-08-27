"use client";

import React, { useState, useEffect } from "react";
import { ngrokHelper, getEnhancedErrorMessage } from "@/lib/utils/ngrok-helper";
import {
  AlertCircle,
  CheckCircle,
  RefreshCw,
  ExternalLink,
  Copy,
} from "lucide-react";
import toast from "react-hot-toast";

export default function NGROKDebugger() {
  const [connectionStatus, setConnectionStatus] = useState<{
    success: boolean;
    error?: string;
    details?: any;
  } | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const config = ngrokHelper.getConfig();

  useEffect(() => {
    // Log connection info on mount
    ngrokHelper.logConnectionInfo();
  }, []);

  const testConnection = async () => {
    setIsTesting(true);
    try {
      const result = await ngrokHelper.testConnection();
      setConnectionStatus(result);

      if (result.success) {
        toast.success("Connection test successful!");
      } else {
        toast.error(`Connection test failed: ${result.error}`);
      }
    } catch (error) {
      setConnectionStatus({
        success: false,
        error: "Test failed",
        details: error,
      });
      toast.error("Connection test failed");
    } finally {
      setIsTesting(false);
    }
  };

  const copyConfig = () => {
    const configText = JSON.stringify(config, null, 2);
    navigator.clipboard.writeText(configText);
    toast.success("Configuration copied to clipboard");
  };

  const openAPITest = () => {
    window.open(`${config.baseURL}/health`, "_blank");
  };

  const troubleshootingSteps = ngrokHelper.getTroubleshootingSteps();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          🔗 NGROK Connection Debugger
        </h2>
        <button
          onClick={testConnection}
          disabled={isTesting}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isTesting ? "animate-spin" : ""}`} />
          <span>{isTesting ? "Testing..." : "Test Connection"}</span>
        </button>
      </div>

      {/* Configuration Info */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Configuration
        </h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-600">
                Base URL:
              </span>
              <p className="text-gray-900 font-mono text-sm break-all">
                {config.baseURL}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">
                Is NGROK:
              </span>
              <p className="text-gray-900">{config.isNGROK ? "Yes" : "No"}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">
                Is Secure:
              </span>
              <p className="text-gray-900">{config.isSecure ? "Yes" : "No"}</p>
            </div>
            {config.tunnelId && (
              <div>
                <span className="text-sm font-medium text-gray-600">
                  Tunnel ID:
                </span>
                <p className="text-gray-900 font-mono text-sm">
                  {config.tunnelId}
                </p>
              </div>
            )}
          </div>
          <div className="mt-3 flex space-x-2">
            <button
              onClick={copyConfig}
              className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
            >
              <Copy className="w-4 h-4" />
              <span>Copy Config</span>
            </button>
            <button
              onClick={openAPITest}
              className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Test API Directly</span>
            </button>
          </div>
        </div>
      </div>

      {/* Connection Status */}
      {connectionStatus && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Connection Status
          </h3>
          <div
            className={`p-4 rounded-lg ${
              connectionStatus.success
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            <div className="flex items-center">
              {connectionStatus.success ? (
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              )}
              <span
                className={`font-medium ${
                  connectionStatus.success ? "text-green-800" : "text-red-800"
                }`}
              >
                {connectionStatus.success
                  ? "Connection Successful"
                  : "Connection Failed"}
              </span>
            </div>
            {connectionStatus.error && (
              <p className="text-sm mt-2 text-gray-700">
                {connectionStatus.error}
              </p>
            )}
            {connectionStatus.details && (
              <div className="mt-3">
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  {showDetails ? "Hide" : "Show"} Details
                </button>
                {showDetails && (
                  <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                    {JSON.stringify(connectionStatus.details, null, 2)}
                  </pre>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Troubleshooting Steps */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Troubleshooting Steps
        </h3>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
            {troubleshootingSteps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>
      </div>

      {/* Environment Variables Check */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Environment Variables
        </h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="space-y-2">
            <div>
              <span className="text-sm font-medium text-gray-600">
                NEXT_PUBLIC_API_URL:
              </span>
              <p className="text-gray-900 font-mono text-sm break-all">
                {process.env.NEXT_PUBLIC_API_URL || "Not set (using default)"}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">
                NODE_ENV:
              </span>
              <p className="text-gray-900 font-mono text-sm">
                {process.env.NODE_ENV}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
