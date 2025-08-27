import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");
    const authorization = request.headers.get("authorization");
    const twitterAccessToken = request.headers.get("x-twitter-access-token");

    // Validate required parameters
    if (!authorization) {
      return NextResponse.json(
        { error: "Authorization header is required" },
        { status: 401 }
      );
    }

    // Validate date format if provided
    if (startDate && !/^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
      return NextResponse.json(
        { error: "Invalid start_date format. Use YYYY-MM-DD" },
        { status: 400 }
      );
    }

    if (endDate && !/^\d{4}-\d{2}-\d{2}$/.test(endDate)) {
      return NextResponse.json(
        { error: "Invalid end_date format. Use YYYY-MM-DD" },
        { status: 400 }
      );
    }

    // Validate date range if both dates are provided
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      return NextResponse.json(
        { error: "start_date cannot be after end_date" },
        { status: 400 }
      );
    }

    // Build query parameters
    const queryParams = new URLSearchParams();

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
      `${backendUrl}/api/v1/x/analytics/user?${queryParams.toString()}`,
      {
        method: "GET",
        headers,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error: data.message || data.error || "Failed to fetch user analytics",
          details: data.details || data.error_description,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("User analytics API error:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: "Failed to fetch user analytics",
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
