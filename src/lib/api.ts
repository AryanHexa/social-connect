import axios from "axios";
import { useAuthStore } from "./auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    // Add CORS headers for NGROK
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, X-Requested-With",
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

    // Add NGROK-specific headers
    if (config.baseURL?.includes("ngrok")) {
      config.headers["ngrok-skip-browser-warning"] = "true";
    }

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
        "CORS error - Please check backend CORS configuration";
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (emailOrUsername: string, password: string) => {
    try {
      const response = await api.post("/auth/login", {
        emailOrUsername,
        password,
      });
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
      const response = await api.get("/x/user", { params: queryParams });
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

// Users API
export const usersAPI = {
  getProfile: async () => {
    try {
      const response = await api.get("/users/profile");
      return response.data;
    } catch (error) {
      console.error("Get Profile API Error:", error);
      throw error;
    }
  },

  updateProfile: async (profileData: any) => {
    try {
      const response = await api.put("/users/profile", profileData);
      return response.data;
    } catch (error) {
      console.error("Update Profile API Error:", error);
      throw error;
    }
  },

  getAllUsers: async (params?: { page?: number; limit?: number }) => {
    try {
      const response = await api.get("/users", { params });
      return response.data;
    } catch (error) {
      console.error("Get All Users API Error:", error);
      throw error;
    }
  },

  getUserById: async (userId: string) => {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Get User By ID API Error:", error);
      throw error;
    }
  },
};

export default api;
