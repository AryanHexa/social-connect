"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuthStore } from "@/lib/auth";
import { authAPI, healthAPI } from "@/lib/api";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

interface LoginFormData {
  emailOrUsername: string;
  password: string;
}

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

export default function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const { login } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await authAPI.login(data.emailOrUsername, data.password);
      console.log("Login response:", response);

      if (response.accessToken) {
        login(response.accessToken, response.user);
        toast.success("Login successful!");
      } else if (response.access_token) {
        // Fallback for different response format
        login(response.access_token, response.user);
        toast.success("Login successful!");
      } else {
        toast.error(response.message || "Login failed");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const checkHealth = async () => {
    setIsCheckingHealth(true);
    setHealthStatus(null);

    try {
      // Run multiple health checks
      const [mainHealth, authHealth, xHealth, instaHealth] =
        await Promise.allSettled([
          healthAPI.check(),
          healthAPI.checkAuth(),
          healthAPI.checkX(),
          healthAPI.checkInsta(),
        ]);

      const results = {
        main:
          mainHealth.status === "fulfilled"
            ? mainHealth.value
            : { success: false, error: mainHealth.reason },
        auth:
          authHealth.status === "fulfilled"
            ? authHealth.value
            : { success: false, error: authHealth.reason },
        x:
          xHealth.status === "fulfilled"
            ? xHealth.value
            : { success: false, error: xHealth.reason },
        insta:
          instaHealth.status === "fulfilled"
            ? instaHealth.value
            : { success: false, error: instaHealth.reason },
      };

      setHealthStatus(results);

      // Show toast based on main health check
      if (results.main.success) {
        toast.success(`✅ API is healthy! (${results})`);
      } else {
        toast.error(`❌ API health check failed (${results || "No response"})`);
      }

      // Log detailed results
      console.log("Health Check Results:", results);
    } catch (error) {
      console.error("Health check error:", error);
      toast.error("Health check failed");
      setHealthStatus({ error: "Health check failed" });
    } finally {
      setIsCheckingHealth(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
          Sign In
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="emailOrUsername"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email or Username
            </label>
            <input
              {...register("emailOrUsername", {
                required: "Email or username is required",
              })}
              type="text"
              id="emailOrUsername"
              className={cn(
                "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
                errors.emailOrUsername ? "border-red-500" : "border-gray-300"
              )}
              placeholder="Enter your email or username"
            />
            {errors.emailOrUsername && (
              <p className="mt-1 text-sm text-red-600">
                {errors.emailOrUsername.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              type="password"
              id="password"
              className={cn(
                "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
                errors.password ? "border-red-500" : "border-gray-300"
              )}
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Health Check Section */}
        <div className="mt-4 border-t pt-4">
          <button
            type="button"
            onClick={checkHealth}
            disabled={isCheckingHealth}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
          >
            {isCheckingHealth
              ? "🔍 Checking API Health..."
              : "🩺 Check API Health"}
          </button>

          {/* Health Status Display */}
          {healthStatus && (
            <div className="mt-3 p-3 bg-gray-50 rounded-md text-xs">
              <div className="font-medium mb-2">API Health Status:</div>

              <div className="space-y-1">
                <div
                  className={`flex items-center justify-between ${
                    healthStatus.main?.success
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  <span>Main API:</span>
                  <span>
                    {healthStatus.main?.success ? "✅ Healthy" : "❌ Failed"}
                  </span>
                </div>

                <div
                  className={`flex items-center justify-between ${
                    healthStatus.auth?.success
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  <span>Auth API:</span>
                  <span>
                    {healthStatus.auth?.success ? "✅ Healthy" : "❌ Failed"}
                  </span>
                </div>

                <div
                  className={`flex items-center justify-between ${
                    healthStatus.x?.success ? "text-green-600" : "text-red-600"
                  }`}
                >
                  <span>X (Twitter) API:</span>
                  <span>
                    {healthStatus.x?.success ? "✅ Healthy" : "❌ Failed"}
                  </span>
                </div>

                <div
                  className={`flex items-center justify-between ${
                    healthStatus.insta?.success
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  <span>Instagram API:</span>
                  <span>
                    {healthStatus.insta?.success ? "✅ Healthy" : "❌ Failed"}
                  </span>
                </div>
              </div>

              {/* API URL Display */}
              {healthStatus.main?.apiUrl && (
                <div className="mt-2 pt-2 border-t text-gray-600">
                  <div className="font-medium">API URL:</div>
                  <div className="break-all">{healthStatus.main.apiUrl}</div>
                </div>
              )}

              {/* Error Details */}
              {!healthStatus.main?.success && healthStatus.main?.error && (
                <div className="mt-2 pt-2 border-t text-red-600">
                  <div className="font-medium">Error:</div>
                  <div className="break-words">
                    {JSON.stringify(healthStatus.main.error, null, 2)}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <button
              onClick={onSwitchToRegister}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
