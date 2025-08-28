import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Generate a random state string for security
    const state =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    // Get the redirect URI
    const redirectUri =
      "https://social-connect-three-indol.vercel.app/auth/instagram/callback";

    // Use your external backend to generate Instagram auth URL
    // Your backend should have the Instagram client credentials configured
    const backendUrl = process.env.BACKEND_API_URL || "http://localhost:3005";
    const authEndpoint = `${backendUrl}/api/v1/insta/auth/login`;

    console.log("Calling external backend for auth URL:", authEndpoint);

    const response = await fetch(authEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        redirectUri: redirectUri,
        state: state,
      }),
    });

    const data = await response.json();

    console.log("Instagram auth URL generation response:", {
      success: response.ok,
      hasAuthUrl: !!data.data?.authUrl,
      state: data.data?.state,
    });

    if (response.ok) {
      // Check if we have an authUrl in the response
      if (data.data && data.data.authUrl) {
        return NextResponse.json({
          success: true,
          message: "Instagram authentication URL generated",
          authUrl: data.data.authUrl,
          state: data.data.state,
        });
      } else {
        return NextResponse.json({
          success: true,
          message: "Instagram authentication successful",
          data: data,
        });
      }
    } else {
      return NextResponse.json(
        {
          success: false,
          error: data.error || "Instagram authentication failed",
          message: data.message || "Failed to generate Instagram auth URL",
          status: response.status,
        },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error("Instagram auth URL generation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to connect to Instagram authentication service",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
