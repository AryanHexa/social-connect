/**
 * NGROK Helper Utilities
 * Handles common NGROK issues and provides debugging tools
 */

export interface NGROKConfig {
  baseURL: string;
  isNGROK: boolean;
  isSecure: boolean;
  tunnelId?: string;
}

export class NGROKHelper {
  private static instance: NGROKHelper;
  private config: NGROKConfig;

  private constructor() {
    this.config = this.detectNGROKConfig();
  }

  static getInstance(): NGROKHelper {
    if (!NGROKHelper.instance) {
      NGROKHelper.instance = new NGROKHelper();
    }
    return NGROKHelper.instance;
  }

  private detectNGROKConfig(): NGROKConfig {
    const baseURL =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";
    const isNGROK = baseURL.includes("ngrok");
    const isSecure = baseURL.startsWith("https");

    return {
      baseURL,
      isNGROK,
      isSecure,
      tunnelId: this.extractTunnelId(baseURL),
    };
  }

  private extractTunnelId(url: string): string | undefined {
    const match = url.match(/ngrok\.io\/([a-zA-Z0-9]+)/);
    return match ? match[1] : undefined;
  }

  getConfig(): NGROKConfig {
    return this.config;
  }

  isNGROK(): boolean {
    return this.config.isNGROK;
  }

  getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (this.config.isNGROK) {
      // Add NGROK-specific headers
      headers["ngrok-skip-browser-warning"] = "true";
      headers["Access-Control-Allow-Origin"] = "*";
      headers["Access-Control-Allow-Methods"] =
        "GET, POST, PUT, DELETE, OPTIONS";
      headers["Access-Control-Allow-Headers"] =
        "Content-Type, Authorization, X-Requested-With";
    }

    return headers;
  }

  getAxiosConfig() {
    return {
      timeout: this.config.isNGROK ? 15000 : 10000,
      headers: this.getHeaders(),
      // Handle SSL issues with NGROK
      ...(this.config.isNGROK && {
        httpsAgent: undefined,
        validateStatus: (status: number) => status < 500, // Accept all status codes for debugging
      }),
    };
  }

  logConnectionInfo() {
    console.group("🔗 NGROK Connection Info");
    console.log("Base URL:", this.config.baseURL);
    console.log("Is NGROK:", this.config.isNGROK);
    console.log("Is Secure:", this.config.isSecure);
    console.log("Tunnel ID:", this.config.tunnelId);
    console.log("Headers:", this.getHeaders());
    console.groupEnd();
  }

  async testConnection(): Promise<{
    success: boolean;
    error?: string;
    details?: any;
  }> {
    try {
      const response = await fetch(`${this.config.baseURL}/health`, {
        method: "GET",
        headers: this.getHeaders(),
        mode: "cors",
      });

      if (response.ok) {
        return { success: true };
      } else {
        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
          details: { status: response.status, statusText: response.statusText },
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        details: {
          code: error.code,
          message: error.message,
          type: error.name,
        },
      };
    }
  }

  getTroubleshootingSteps(): string[] {
    const steps = [];

    if (this.config.isNGROK) {
      steps.push(
        "1. Check if NGROK tunnel is active: ngrok http 3000",
        "2. Verify the NGROK URL in your environment variables",
        "3. Check browser console for CORS errors",
        "4. Ensure backend CORS is configured for NGROK domain",
        "5. Try accessing the API directly in browser to test connectivity",
        "6. Check if backend is running on the correct port",
        "7. Verify SSL certificate (NGROK free tier has limitations)"
      );
    } else {
      steps.push(
        "1. Check if backend server is running",
        "2. Verify the API URL in environment variables",
        "3. Check browser console for network errors",
        "4. Ensure CORS is properly configured on backend",
        "5. Try accessing the API directly in browser"
      );
    }

    return steps;
  }
}

// Export singleton instance
export const ngrokHelper = NGROKHelper.getInstance();

// Utility function to check if we're in development with NGROK
export const isDevelopmentWithNGROK = (): boolean => {
  return process.env.NODE_ENV === "development" && ngrokHelper.isNGROK();
};

// Utility function to get enhanced error message
export const getEnhancedErrorMessage = (error: any): string => {
  if (error.userMessage) {
    return error.userMessage;
  }

  if (ngrokHelper.isNGROK()) {
    if (error.code === "ECONNREFUSED") {
      return "Cannot connect to NGROK tunnel. Please check if the tunnel is active and the backend is running.";
    }
    if (
      error.code === "CERT_HAS_EXPIRED" ||
      error.code === "UNABLE_TO_VERIFY_LEAF_SIGNATURE"
    ) {
      return "SSL certificate issue with NGROK. This is common with free tier. Try upgrading to NGROK Pro or use HTTP.";
    }
    if (error.message.includes("Network Error")) {
      return "Network error with NGROK tunnel. Please check your connection and try again.";
    }
  }

  return error.message || "An unexpected error occurred";
};
