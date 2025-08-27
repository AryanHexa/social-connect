import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tweetIds = searchParams.get("tweet_ids");
    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");
    const authorization = request.headers.get("authorization");
    const twitterAccessToken = request.headers.get("x-twitter-access-token");

    // Validate required parameters
    if (!tweetIds) {
      return NextResponse.json(
        { error: "Tweet IDs parameter is required" },
        { status: 400 }
      );
    }

    if (!authorization) {
      return NextResponse.json(
        { error: "Authorization header is required" },
        { status: 401 }
      );
    }

    // Validate tweet IDs format
    const tweetIdsArray = tweetIds
      .split(",")
      .map((id) => id.trim())
      .filter((id) => id);

    if (tweetIdsArray.length === 0) {
      return NextResponse.json(
        { error: "At least one valid tweet ID is required" },
        { status: 400 }
      );
    }

    if (tweetIdsArray.length > 100) {
      return NextResponse.json(
        { error: "Maximum 100 tweet IDs allowed per request" },
        { status: 400 }
      );
    }

    // Validate tweet ID format (should be numeric)
    const invalidTweetIds = tweetIdsArray.filter((id) => !/^\d+$/.test(id));
    if (invalidTweetIds.length > 0) {
      return NextResponse.json(
        {
          error: `Invalid tweet ID format: ${invalidTweetIds.join(
            ", "
          )}. Tweet IDs must be numeric.`,
        },
        { status: 400 }
      );
    }

    // Build query parameters
    const queryParams = new URLSearchParams();
    queryParams.append("tweet_ids", tweetIds);

    if (startDate) {
      queryParams.append("start_date", startDate);
    }

    if (endDate) {
      queryParams.append("end_date", endDate);
    }

    // Prepare headers for backend request
    const headers: Record<string, string> = {
      Authorization: authorization,
      "Content-Type": "application/json",
    };

    if (twitterAccessToken) {
      headers["X-Twitter-Access-Token"] = twitterAccessToken;
    }

    // Make request to backend gateway
    const backendUrl = process.env.BACKEND_API_URL || "http://localhost:3000";
    const response = await fetch(
      `${backendUrl}/api/v1/x/analytics/tweets?${queryParams.toString()}`,
      {
        method: "GET",
        headers,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error:
            data.message || data.error || "Failed to fetch tweet analytics",
          details: data.details || data.error_description,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Tweet analytics API error:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: "Failed to fetch tweet analytics",
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
