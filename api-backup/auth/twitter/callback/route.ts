import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  if (error) {
    // Redirect to frontend with error
    const redirectUrl = new URL("/dashboard/twitter/profile", request.url);
    redirectUrl.searchParams.set("error", error);
    redirectUrl.searchParams.set(
      "error_description",
      searchParams.get("error_description") || "OAuth error"
    );
    return NextResponse.redirect(redirectUrl);
  }

  if (!code) {
    // Redirect to frontend with error
    const redirectUrl = new URL("/dashboard/twitter/profile", request.url);
    redirectUrl.searchParams.set("error", "missing_code");
    redirectUrl.searchParams.set(
      "error_description",
      "Authorization code not received"
    );
    return NextResponse.redirect(redirectUrl);
  }

  try {
    // Exchange code for access token by calling your backend
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const response = await fetch(
      `${backendUrl}/api/v1/x/auth/twitter/callback?code=${code}&state=${state}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to exchange code for token");
    }

    const data = await response.json();

    // Redirect to frontend with success
    const redirectUrl = new URL("/dashboard/twitter/profile", request.url);
    redirectUrl.searchParams.set("success", "true");
    redirectUrl.searchParams.set(
      "message",
      "Twitter account connected successfully"
    );

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("Twitter OAuth callback error:", error);

    // Redirect to frontend with error
    const redirectUrl = new URL("/dashboard/twitter/profile", request.url);
    redirectUrl.searchParams.set("error", "token_exchange_failed");
    redirectUrl.searchParams.set(
      "error_description",
      "Failed to complete authentication"
    );

    return NextResponse.redirect(redirectUrl);
  }
}
