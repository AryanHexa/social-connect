import { NextRequest, NextResponse } from "next/server";

interface InstagramTokenResponse {
  accessToken: string;
  user: {
    id: string;
    username: string;
    name: string;
    profilePictureUrl: string;
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Extract parameters from the callback URL
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");

    console.log("Instagram callback received:", {
      code: code ? "***" + code.slice(-4) : null,
      state,
      error,
      errorDescription,
    });

    // Handle OAuth error
    if (error) {
      console.error("Instagram OAuth error:", error, errorDescription);

      // Redirect to frontend with error
      const frontendUrl = new URL("/", request.url);
      frontendUrl.searchParams.set("error", error);
      if (errorDescription) {
        frontendUrl.searchParams.set("error_description", errorDescription);
      }

      return NextResponse.redirect(frontendUrl);
    }

    // Validate required parameters
    if (!code || !state) {
      console.error("Missing required parameters:", {
        code: !!code,
        state: !!state,
      });

      const frontendUrl = new URL("/", request.url);
      frontendUrl.searchParams.set("error", "missing_parameters");
      frontendUrl.searchParams.set(
        "error_description",
        "Missing authorization code or state parameter"
      );

      return NextResponse.redirect(frontendUrl);
    }

    // Call the external Instagram callback endpoint to exchange code for tokens
    const callbackUrl = `http://localhost:3005/api/v1/auth/instagram/callback?code=${encodeURIComponent(
      code
    )}&state=${encodeURIComponent(state)}`;

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

      const frontendUrl = new URL("/", request.url);
      frontendUrl.searchParams.set("success", "true");
      frontendUrl.searchParams.set("platform", "instagram");
      frontendUrl.searchParams.set(
        "username",
        tokenData.user?.username || "user"
      );

      // TODO: Store the tokens in a database or session here
      // Example: await storeUserTokens(tokenData.user.id, tokenData.accessToken);

      return NextResponse.redirect(frontendUrl);
    } else {
      // Token exchange failed
      console.error("Token exchange failed:", tokenData);

      const frontendUrl = new URL("/", request.url);
      frontendUrl.searchParams.set("error", "token_exchange_failed");
      frontendUrl.searchParams.set(
        "error_description",
        tokenData.error || "Failed to exchange code for tokens"
      );

      return NextResponse.redirect(frontendUrl);
    }
  } catch (error) {
    console.error("Instagram callback error:", error);

    // Redirect to frontend with error
    const frontendUrl = new URL("/", request.url);
    frontendUrl.searchParams.set("error", "callback_error");
    frontendUrl.searchParams.set(
      "error_description",
      error instanceof Error ? error.message : "Unknown error"
    );

    return NextResponse.redirect(frontendUrl);
  }
}
