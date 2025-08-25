export interface AuthResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: any;
  status?: number;
  details?: string;
}

export interface PlatformConfig {
  name: string;
  endpoint: string;
  isExternal?: boolean;
}

export const PLATFORM_CONFIGS: Record<string, PlatformConfig> = {
  instagram: {
    name: "Instagram",
    endpoint: "/api/auth/instagram/login",
    isExternal: true,
  },
  twitter: {
    name: "Twitter",
    endpoint: "/api/auth/twitter/login",
  },
  facebook: {
    name: "Facebook",
    endpoint: "/api/auth/facebook/login",
  },
};

export async function authenticatePlatform(
  platform: string,
  data?: any
): Promise<AuthResponse> {
  try {
    const config = PLATFORM_CONFIGS[platform.toLowerCase()];
    if (!config) {
      throw new Error(`Unknown platform: ${platform}`);
    }

    // For Instagram, we don't need to send additional data from client
    // The server will handle the required parameters
    const requestBody =
      platform.toLowerCase() === "instagram" ? {} : data || {};

    const response = await fetch(config.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const result = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: result.message || `${config.name} authentication successful`,
        data: result.data,
      };
    } else {
      return {
        success: false,
        error: result.error || `${config.name} authentication failed`,
        status: response.status,
      };
    }
  } catch (error) {
    console.error(`${platform} authentication error:`, error);
    return {
      success: false,
      error: `Failed to connect to ${platform} authentication service`,
      details: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
