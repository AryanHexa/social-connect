import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Only handle API routes that go to NGROK
  if (request.nextUrl.pathname.startsWith("/api/v1/")) {
    // Create a new headers object
    const requestHeaders = new Headers(request.headers);

    // Add NGROK bypass headers
    requestHeaders.set("ngrok-skip-browser-warning", "true");
    requestHeaders.set("User-Agent", "SocialConnect-Frontend/1.0");

    // Create response with modified headers
    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/v1/:path*",
};
