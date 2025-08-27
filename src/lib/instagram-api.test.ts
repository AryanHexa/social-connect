/**
 * Simple test file for Instagram analytics API integration
 * This file can be used to test the Instagram analytics endpoints manually
 */

import { xAPI } from "./api";

// Mock data for testing
const mockPostIds = ["ABC123", "DEF456"];
const mockDateRange = {
  start_date: "2024-01-01",
  end_date: "2024-01-31",
};

// Test function for Instagram user analytics
export async function testInstagramUserAnalytics() {
  try {
    console.log("Testing Instagram user analytics...");
    const result = await xAPI.getInstagramUserAnalytics(mockDateRange);
    console.log("Instagram user analytics result:", result);
    return result;
  } catch (error) {
    console.error("Instagram user analytics test failed:", error);
    throw error;
  }
}

// Test function for Instagram post analytics
export async function testInstagramPostAnalytics() {
  try {
    console.log("Testing Instagram post analytics...");
    const result = await xAPI.getInstagramPostAnalytics({
      post_ids: mockPostIds.join(","),
      ...mockDateRange,
    });
    console.log("Instagram post analytics result:", result);
    return result;
  } catch (error) {
    console.error("Instagram post analytics test failed:", error);
    throw error;
  }
}

// Test function for error handling
export async function testInstagramErrorHandling() {
  try {
    console.log("Testing Instagram error handling...");
    // Test with invalid post IDs
    await xAPI.getInstagramPostAnalytics({
      post_ids: "invalid,ids",
      ...mockDateRange,
    });
  } catch (error) {
    console.log("Expected Instagram error caught:", error);
    return error;
  }
}

// Run all Instagram tests
export async function runInstagramAnalyticsTests() {
  console.log("Starting Instagram analytics integration tests...");

  try {
    // Test Instagram user analytics
    await testInstagramUserAnalytics();

    // Test Instagram post analytics
    await testInstagramPostAnalytics();

    // Test error handling
    await testInstagramErrorHandling();

    console.log("All Instagram tests completed successfully!");
  } catch (error) {
    console.error("Instagram test suite failed:", error);
  }
}

// Export for manual testing
if (typeof window !== "undefined") {
  (window as any).testInstagramAnalytics = {
    testInstagramUserAnalytics,
    testInstagramPostAnalytics,
    testInstagramErrorHandling,
    runInstagramAnalyticsTests,
  };
}
