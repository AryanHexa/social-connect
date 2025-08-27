export interface ApiError {
  message: string;
  status?: number;
  details?: string;
}

export function handleApiError(error: any): ApiError {
  console.error("API Error:", error);

  // Handle axios errors
  if (error.response) {
    const { status, data } = error.response;

    return {
      message: data?.error || data?.message || `HTTP ${status} Error`,
      status,
      details: data?.details || data?.error_description || error.message,
    };
  }

  // Handle network errors
  if (error.request) {
    return {
      message: "Network error - unable to connect to server",
      details: error.message,
    };
  }

  // Handle other errors
  if (error.message) {
    return {
      message: error.message,
      details: error.stack,
    };
  }

  // Fallback
  return {
    message: "An unexpected error occurred",
    details: error.toString(),
  };
}

export function getErrorMessage(error: any): string {
  const apiError = handleApiError(error);
  return apiError.message;
}

export function getErrorDetails(error: any): string | undefined {
  const apiError = handleApiError(error);
  return apiError.details;
}

export function isNetworkError(error: any): boolean {
  return (
    error.code === "ECONNREFUSED" ||
    error.code === "ETIMEDOUT" ||
    error.message?.includes("Network Error") ||
    error.message?.includes("Failed to fetch")
  );
}

export function isAuthError(error: any): boolean {
  return (
    error.response?.status === 401 ||
    error.response?.status === 403 ||
    error.message?.includes("unauthorized") ||
    error.message?.includes("forbidden")
  );
}

export function isRateLimitError(error: any): boolean {
  return (
    error.response?.status === 429 ||
    error.message?.includes("rate limit") ||
    error.message?.includes("too many requests")
  );
}

export function getRetryDelay(error: any): number {
  if (isRateLimitError(error)) {
    // Return retry delay from headers or default to 60 seconds
    const retryAfter = error.response?.headers?.["retry-after"];
    return retryAfter ? parseInt(retryAfter) * 1000 : 60000;
  }
  return 5000; // Default 5 second delay
}
