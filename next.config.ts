import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove output: "export" to enable API routes and rewrites for Vercel
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Configure headers for NGROK
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "ngrok-skip-browser-warning",
            value: "true",
          },
        ],
      },
    ];
  },
  // Proxy API calls to NGROK backend (works on Vercel)
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*", // frontend calls /api/v1/*
        destination: "https://ece35c06d568.ngrok-free.app/api/v1/:path*", // proxy to NGROK backend
      },
    ];
  },
};

export default nextConfig;
