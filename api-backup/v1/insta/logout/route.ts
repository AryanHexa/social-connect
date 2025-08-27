import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        {
          success: false,
          error: "Authorization header is required",
        },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: "Valid JWT token is required",
        },
        { status: 401 }
      );
    }

    // Call the external Instagram logout endpoint
    const response = await fetch("http://localhost:3005/api/v1/insta/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      return NextResponse.json({
        success: true,
        message: "Successfully logged out from Instagram",
        platform: "instagram",
        loggedOutAt: new Date().toISOString(),
        data: data,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: data.error || "Failed to logout from Instagram",
          status: response.status,
        },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error("Instagram logout error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to connect to Instagram logout service",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
