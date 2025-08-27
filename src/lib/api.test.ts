/**
 * Simple test file for analytics API integration
 * This file can be used to test the analytics endpoints manually
 */

import { xAPI } from "./api";

// Mock data for testing
const mockTweetIds = ["1234567890", "9876543210"];
const mockDateRange = {
  start_date: "2024-01-01",
  end_date: "2024-01-31",
};

// Test function for user analytics
export async function testUserAnalytics() {
  try {
    console.log("Testing user analytics...");
    const result = await xAPI.getUserAnalytics(mockDateRange);
    console.log("User analytics result:", result);
    return result;
  } catch (error) {
    console.error("User analytics test failed:", error);
    throw error;
  }
}

// Test function for tweet analytics
export async function testTweetAnalytics() {
  try {
    console.log("Testing tweet analytics...");
    const result = await xAPI.getTweetAnalytics({
      tweet_ids: mockTweetIds.join(","),
      ...mockDateRange,
    });
    console.log("Tweet analytics result:", result);
    return result;
  } catch (error) {
    console.error("Tweet analytics test failed:", error);
    throw error;
  }
}

// Test function for error handling
export async function testErrorHandling() {
  try {
    console.log("Testing error handling...");
    // Test with invalid tweet IDs
    await xAPI.getTweetAnalytics({
      tweet_ids: "invalid,ids",
      ...mockDateRange,
    });
  } catch (error) {
    console.log("Expected error caught:", error);
    return error;
  }
}

// Run all tests
export async function runAnalyticsTests() {
  console.log("Starting analytics integration tests...");

  try {
    // Test user analytics
    await testUserAnalytics();

    // Test tweet analytics
    await testTweetAnalytics();

    // Test error handling
    await testErrorHandling();

    console.log("All tests completed successfully!");
  } catch (error) {
    console.error("Test suite failed:", error);
  }
}

// Export for manual testing
if (typeof window !== "undefined") {
  (window as any).testAnalytics = {
    testUserAnalytics,
    testTweetAnalytics,
    testErrorHandling,
    runAnalyticsTests,
  };
}
