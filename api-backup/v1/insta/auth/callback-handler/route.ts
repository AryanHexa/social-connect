import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { code, state, userId } = await request.json();

    console.log("Instagram callback handler received:", {
      code: code ? `${code.substring(0, 20)}...` : null,
      state,
      userId,
    });

    // Validate required parameters
    if (!code || !state || !userId) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required parameters",
          message: "Code, state, and userId are required",
        },
        { status: 400 }
      );
    }

    // Call the external Instagram callback endpoint to exchange code for tokens
    const callbackUrl = `http://localhost:3005/api/v1/auth/instagram/callback?code=${encodeURIComponent(
      code
    )}&state=${encodeURIComponent(state)}&userId=${encodeURIComponent(userId)}`;

    const tokenResponse = await fetch(callbackUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const tokenData = await tokenResponse.json();
    console.log("Token exchange response:", tokenData);

    if (tokenResponse.ok && tokenData.accessToken) {
      // Successfully obtained tokens and user data
      console.log("Instagram authentication successful:", {
        accessToken: "***" + tokenData.accessToken.slice(-4),
        userId: tokenData.user?.id,
        username: tokenData.user?.username,
        name: tokenData.user?.name,
      });

      return NextResponse.json({
        success: true,
        message: "Instagram account connected successfully!",
        data: {
          accessToken: tokenData.accessToken,
          user: tokenData.user,
        },
      });
    } else {
      // Token exchange failed
      console.error("Token exchange failed:", tokenData);

      return NextResponse.json(
        {
          success: false,
          error: "token_exchange_failed",
          message: tokenData.error || "Failed to exchange code for tokens",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Instagram callback handler error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "callback_error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
