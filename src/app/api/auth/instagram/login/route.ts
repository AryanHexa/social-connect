import { NextRequest, NextResponse } from "next/server";
import { REDIRECT_URI } from "../../config";

export async function POST(request: NextRequest) {
  try {
    // Generate a random state string
    const state =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    // Prepare the request body with required parameters
    const requestBody = {
      redirectUri: REDIRECT_URI,
      state: state,
    };

    // Call the external Instagram authentication endpoint
    const response = await fetch(
      "http://localhost:3000/api/v1/insta/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    const data = await response.json();

    console.log({ data });

    if (response.ok) {
      // Check if we have an authUrl in the response
      if (data.data && data.data.authUrl) {
        return NextResponse.json({
          success: true,
          message: "Instagram authentication URL generated",
          data: {
            authUrl: data.data.authUrl,
            state: data.data.state,
            redirect: true,
          },
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
          status: response.status,
        },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error("Instagram authentication error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to connect to Instagram authentication service",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
