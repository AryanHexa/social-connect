import axios from "axios";
import { useAuthStore } from "./auth";

// Vercel supports server-side proxy via rewrites
const getApiBaseUrl = () => {
  // If explicitly set, use it
  if (process.env.NEXT_PUBLIC_API_URL) {
    console.log(
      "Using explicit NEXT_PUBLIC_API_URL:",
      process.env.NEXT_PUBLIC_API_URL
    );
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // For Vercel, always use proxy path - Vercel handles the rewrites
  const url = "/api/v1";

  console.log("Vercel API Config:", {
    hostname:
      typeof window !== "undefined" ? window.location.hostname : "server",
    port: typeof window !== "undefined" ? window.location.port : "N/A",
    protocol: typeof window !== "undefined" ? window.location.protocol : "N/A",
    NODE_ENV: process.env.NODE_ENV,
    VERCEL: process.env.VERCEL,
    apiUrl: url,
    note: "Vercel proxy rewrites /api/v1/* to NGROK backend",
  });

  return url;
};

const API_BASE_URL = getApiBaseUrl();

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // Add timeout and better error handling
  timeout: 15000, // Increased timeout for NGROK
  // Handle SSL/TLS issues with NGROK
  httpsAgent: process.env.NODE_ENV === "development" ? undefined : undefined,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Always add NGROK-specific headers since we're proxying to NGROK
    config.headers["ngrok-skip-browser-warning"] = "true";
    config.headers["User-Agent"] = "SocialConnect-Frontend/1.0";

    // Log request for debugging
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, {
      baseURL: config.baseURL,
      headers: config.headers,
      data: config.data,
      fullURL: `${config.baseURL}${config.url}`,
    });

    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => {
    // Log successful response for debugging
    console.log(
      `API Response: ${response.status} ${response.config.url}`,
      response.data
    );
    return response;
  },
  (error) => {
    // Enhanced error logging for NGROK debugging
    console.error("API Response Error:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method,
      data: error.response?.data,
      message: error.message,
      code: error.code,
      baseURL: error.config?.baseURL,
      fullURL: error.config?.baseURL + error.config?.url,
    });

    // Handle specific NGROK errors
    if (error.code === "ECONNREFUSED") {
      console.error(
        "Connection refused - Check if backend is running and NGROK tunnel is active"
      );
    }

    if (
      error.code === "CERT_HAS_EXPIRED" ||
      error.code === "UNABLE_TO_VERIFY_LEAF_SIGNATURE"
    ) {
      console.error(
        "SSL Certificate issue - This is common with NGROK free tier"
      );
    }

    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }

    // Provide user-friendly error messages
    if (error.message.includes("Network Error")) {
      error.userMessage =
        "Network error - Please check your connection and try again";
    } else if (error.code === "ECONNREFUSED") {
      error.userMessage =
        "Cannot connect to server - Please check if the backend is running";
    } else if (error.response?.status === 0) {
      error.userMessage =
        "Network connection failed - Please check your internet connection";
    }

    return Promise.reject(error);
  }
);

// Health Check API
export const healthAPI = {
  check: async () => {
    console.log("Health Check - API_BASE_URL:", API_BASE_URL);

    try {
      const response = await api.get("/health");
      console.log("Health Check Response:", response.data);
      return {
        success: true,
        status: response.status,
        data: response.data,
        apiUrl: API_BASE_URL,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      console.error("Health Check Error:", error);
      return {
        success: false,
        status: error.response?.status || 0,
        error: error.response?.data || error.message,
        apiUrl: API_BASE_URL,
        timestamp: new Date().toISOString(),
      };
    }
  },

  // Alternative health check endpoints
  checkAuth: async () => {
    try {
      const response = await api.get("/auth/health");
      return {
        success: true,
        endpoint: "/auth/health",
        status: response.status,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        endpoint: "/auth/health",
        status: error.response?.status || 0,
        error: error.response?.data || error.message,
      };
    }
  },

  checkX: async () => {
    try {
      const response = await api.get("/x/health");
      return {
        success: true,
        endpoint: "/x/health",
        status: response.status,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        endpoint: "/x/health",
        status: error.response?.status || 0,
        error: error.response?.data || error.message,
      };
    }
  },

  checkInsta: async () => {
    try {
      const response = await api.get("/insta/health");
      return {
        success: true,
        endpoint: "/insta/health",
        status: response.status,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        endpoint: "/insta/health",
        status: error.response?.status || 0,
        error: error.response?.data || error.message,
      };
    }
  },
};

// Auth API
export const authAPI = {
  login: async (emailOrUsername: string, password: string) => {
    console.log("API_BASE_URL", API_BASE_URL);

    try {
      const response = await api.post("/auth/login", {
        emailOrUsername,
        password,
      });
      console.log("Login API Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Login API Error:", error);
      throw error;
    }
  },

  register: async (email: string, password: string, username?: string) => {
    try {
      const response = await api.post("/auth/register", {
        email,
        password,
        username,
      });
      return response.data;
    } catch (error) {
      console.error("Register API Error:", error);
      throw error;
    }
  },

  refreshToken: async (refreshToken: string) => {
    try {
      const response = await api.post("/auth/refresh", { refreshToken });
      return response.data;
    } catch (error) {
      console.error("Refresh Token API Error:", error);
      throw error;
    }
  },
};

// Admin Auth API
export const adminAuthAPI = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post("/admin/auth/login", {
        email,
        password,
      });
      console.log("Admin Login API Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Admin Login API Error:", error);
      throw error;
    }
  },

  refreshToken: async (refreshToken: string) => {
    try {
      const response = await api.post("/admin/auth/refresh", { refreshToken });
      return response.data;
    } catch (error) {
      console.error("Admin Refresh Token API Error:", error);
      throw error;
    }
  },

  logout: async () => {
    try {
      const response = await api.post("/admin/auth/logout");
      return response.data;
    } catch (error) {
      console.error("Admin Logout API Error:", error);
      throw error;
    }
  },
};

// X (Twitter) API
export const xAPI = {
  // User endpoints
  getUser: async (params?: {
    sync?: string;
    limit?: string;
    skip?: string;
  }) => {
    try {
      // Set sync to true by default if not provided
      const queryParams = {
        sync: "true",
        ...params,
      };
      console.log("getting user: ", queryParams);
      const response = await api.get("/x", { params: queryParams });
      console.log("Get User API Response: ", { resData: response.data });
      return response.data;
    } catch (error) {
      console.error("Get User API Error:", error);
      throw error;
    }
  },

  getUserByTwitterId: async (twitterId: string) => {
    try {
      const response = await api.get(`/x/user/${twitterId}`);
      return response.data;
    } catch (error) {
      console.error("Get User By Twitter ID API Error:", error);
      throw error;
    }
  },

  getAllUsers: async (limit: number = 100, skip: number = 0) => {
    try {
      const response = await api.get("/x/admin/users", {
        params: { limit, skip },
      });
      return response.data;
    } catch (error) {
      console.error("Get All Users API Error:", error);
      throw error;
    }
  },

  // Posts endpoints
  getPosts: async (params?: {
    sync?: string;
    limit?: string;
    skip?: string;
    after?: string;
  }) => {
    try {
      // Set sync to true by default if not provided
      const queryParams = {
        sync: "true",
        ...params,
      };
      const response = await api.get("/x/posts", { params: queryParams });
      return response.data;
    } catch (error) {
      console.error("Get Posts API Error:", error);
      throw error;
    }
  },

  // Connection endpoints
  connectTwitterAccount: async (accessToken: string, username?: string) => {
    try {
      const response = await api.post("/x/connect", { accessToken, username });
      return response.data;
    } catch (error) {
      console.error("Connect Twitter Account API Error:", error);
      throw error;
    }
  },

  // Connect with authorization code (sends code as accessToken)
  connectWithCode: async (code: string, username?: string) => {
    try {
      // Send the authorization code as accessToken to match backend expectation
      const response = await api.post("/x/connect", {
        accessToken: code,
        username,
      });
      return response.data;
    } catch (error) {
      console.error("Connect With Code API Error:", error);
      throw error;
    }
  },

  // Generate OAuth2 authorization URL
  generateAuthUrl: async () => {
    try {
      const response = await api.get("/x/auth/url");
      return response.data;
    } catch (error) {
      console.error("Generate Auth URL API Error:", error);
      throw error;
    }
  },

  // Handle OAuth2 callback
  handleOAuthCallback: async (code: string, state: string) => {
    try {
      const response = await api.post("/x/auth/callback", { code, state });
      return response.data;
    } catch (error) {
      console.error("Handle OAuth Callback API Error:", error);
      throw error;
    }
  },

  // Content generation
  generateContent: async (contentData: {
    platform: string;
    contentType: string;
    hashtags?: boolean;
    niche?: string;
    ica?: string;
    userProfileBio?: string;
    trendingTopic?: string;
    maxPostsToAnalyze?: string;
  }) => {
    try {
      const response = await api.post("/x/generate-content", contentData);
      return response.data;
    } catch (error) {
      console.error("Generate Content API Error:", error);
      throw error;
    }
  },

  // Analytics endpoints
  getTweetAnalytics: async (
    params: {
      tweet_ids: string;
      start_date?: string;
      end_date?: string;
    },
    twitterAccessToken?: string
  ) => {
    try {
      const headers: Record<string, string> = {};
      if (twitterAccessToken) {
        headers["X-Twitter-Access-Token"] = twitterAccessToken;
      }

      const response = await api.get("/x/analytics/tweets", {
        params,
        headers,
      });
      return response.data;
    } catch (error) {
      console.error("Get Tweet Analytics API Error:", error);
      throw error;
    }
  },

  getUserAnalytics: async (
    params?: {
      start_date?: string;
      end_date?: string;
    },
    twitterAccessToken?: string
  ) => {
    try {
      const headers: Record<string, string> = {};
      if (twitterAccessToken) {
        headers["X-Twitter-Access-Token"] = twitterAccessToken;
      }

      const response = await api.get("/x/analytics/user", {
        params,
        headers,
      });
      return response.data;
    } catch (error) {
      console.error("Get User Analytics API Error:", error);
      throw error;
    }
  },

  // Logout endpoint
  logout: async () => {
    try {
      const response = await api.post("/x/logout");
      return response.data;
    } catch (error) {
      console.error("Twitter Logout API Error:", error);
      throw error;
    }
  },
};

// Users API
// Instagram API
export const instagramAPI = {
  // User endpoints
  getUser: async (
    params?: {
      sync?: string;
      limit?: string;
      skip?: string;
      username?: string;
    },
    instagramAccessToken?: string
  ) => {
    try {
      const headers: Record<string, string> = {};
      if (instagramAccessToken) {
        headers["X-Instagram-Access-Token"] = instagramAccessToken;
      }

      const response = await api.get("/insta/user", {
        params,
        headers,
      });
      return response.data;
    } catch (error) {
      console.error("Get Instagram User API Error:", error);
      throw error;
    }
  },

  getUserByInstagramId: async (instagramId: string) => {
    try {
      const response = await api.get(`/insta/user/${instagramId}`);
      return response.data;
    } catch (error) {
      console.error("Get Instagram User By ID API Error:", error);
      throw error;
    }
  },

  getAllUsers: async (limit: number = 100, skip: number = 0) => {
    try {
      const response = await api.get("/insta/admin/users", {
        params: { limit, skip },
      });
      return response.data;
    } catch (error) {
      console.error("Get All Instagram Users API Error:", error);
      throw error;
    }
  },

  // Posts endpoints
  getPosts: async (
    params?: {
      sync?: string;
      limit?: string;
      skip?: string;
      after?: string;
    },
    instagramAccessToken?: string
  ) => {
    try {
      const headers: Record<string, string> = {};
      if (instagramAccessToken) {
        headers["X-Instagram-Access-Token"] = instagramAccessToken;
      }

      const response = await api.get("/insta/posts", {
        params,
        headers,
      });
      return response.data;
    } catch (error) {
      console.error("Get Instagram Posts API Error:", error);
      throw error;
    }
  },

  // Authentication endpoints
  generateAuthUrl: async () => {
    try {
      const response = await api.get("/insta/auth/url");
      return response.data;
    } catch (error) {
      console.error("Generate Instagram Auth URL API Error:", error);
      throw error;
    }
  },

  handleOAuthCallback: async (callbackData: {
    code: string;
    state: string;
  }) => {
    try {
      const response = await api.post("/insta/auth/callback", callbackData);
      return response.data;
    } catch (error) {
      console.error("Instagram OAuth Callback API Error:", error);
      throw error;
    }
  },

  // Content generation
  generateContent: async (contentData: {
    platform: string;
    contentType: string;
    hashtags?: boolean;
    niche?: string;
    ica?: string;
    userProfileBio?: string;
    trendingTopic?: string;
    maxPostsToAnalyze?: string;
  }) => {
    try {
      const response = await api.post("/insta/generate-content", contentData);
      return response.data;
    } catch (error) {
      console.error("Generate Instagram Content API Error:", error);
      throw error;
    }
  },

  // Analytics endpoints
  getPostAnalytics: async (
    params: {
      post_ids: string;
      start_date?: string;
      end_date?: string;
    },
    instagramAccessToken?: string
  ) => {
    try {
      const headers: Record<string, string> = {};
      if (instagramAccessToken) {
        headers["X-Instagram-Access-Token"] = instagramAccessToken;
      }

      const response = await api.get("/insta/analytics/posts", {
        params,
        headers,
      });
      return response.data;
    } catch (error) {
      console.error("Get Instagram Post Analytics API Error:", error);
      throw error;
    }
  },

  getUserAnalytics: async (
    params?: {
      start_date?: string;
      end_date?: string;
    },
    instagramAccessToken?: string
  ) => {
    try {
      const headers: Record<string, string> = {};
      if (instagramAccessToken) {
        headers["X-Instagram-Access-Token"] = instagramAccessToken;
      }

      const response = await api.get("/insta/analytics/user", {
        params,
        headers,
      });
      return response.data;
    } catch (error) {
      console.error("Get Instagram User Analytics API Error:", error);
      throw error;
    }
  },

  // Logout endpoint
  logout: async () => {
    try {
      const response = await api.post("/insta/logout");
      return response.data;
    } catch (error) {
      console.error("Instagram Logout API Error:", error);
      throw error;
    }
  },
};

// Users API (Admin endpoints)
export const usersAPI = {
  // User profile management
  getProfile: async () => {
    try {
      const response = await api.get("/auth/profile");
      return response.data;
    } catch (error) {
      console.error("Get Profile API Error:", error);
      throw error;
    }
  },

  updateProfile: async (profileData: any) => {
    try {
      const response = await api.put("/auth/profile", profileData);
      return response.data;
    } catch (error) {
      console.error("Update Profile API Error:", error);
      throw error;
    }
  },

  changePassword: async (changePasswordData: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    try {
      const response = await api.put(
        "/auth/change-password",
        changePasswordData
      );
      return response.data;
    } catch (error) {
      console.error("Change Password API Error:", error);
      throw error;
    }
  },

  logout: async (logoutData?: { refreshToken?: string }) => {
    try {
      const response = await api.post("/auth/logout", logoutData);
      return response.data;
    } catch (error) {
      console.error("Logout API Error:", error);
      throw error;
    }
  },

  // Admin user management endpoints
  getAllUsers: async (params?: {
    page?: number;
    limit?: number;
    status?: number;
    role?: string;
  }) => {
    try {
      const response = await api.get("/admin/users", { params });
      return response.data;
    } catch (error) {
      console.error("Get All Users API Error:", error);
      throw error;
    }
  },

  getUserById: async (userId: string) => {
    try {
      const response = await api.get(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Get User By ID API Error:", error);
      throw error;
    }
  },

  createUser: async (userData: {
    email: string;
    password: string;
    username?: string;
    role?: string;
  }) => {
    try {
      const response = await api.post("/admin/users", userData);
      return response.data;
    } catch (error) {
      console.error("Create User API Error:", error);
      throw error;
    }
  },

  updateUser: async (
    userId: string,
    userData: {
      email?: string;
      username?: string;
      role?: string;
      status?: number;
    }
  ) => {
    try {
      const response = await api.put(`/admin/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error("Update User API Error:", error);
      throw error;
    }
  },

  deleteUser: async (userId: string) => {
    try {
      const response = await api.delete(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Delete User API Error:", error);
      throw error;
    }
  },

  changeUserPassword: async (
    userId: string,
    passwordData: {
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
    }
  ) => {
    try {
      const response = await api.put(
        `/admin/users/${userId}/change-password`,
        passwordData
      );
      return response.data;
    } catch (error) {
      console.error("Change User Password API Error:", error);
      throw error;
    }
  },
};

export default api;
