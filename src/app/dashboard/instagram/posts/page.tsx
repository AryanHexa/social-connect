"use client";

import InstagramPosts from "@/components/instagram/InstagramPosts";

export default function InstagramPostsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Instagram Posts
        </h1>
        <p className="text-gray-600">
          View and manage your Instagram posts with detailed analytics.
        </p>
      </div>

      <InstagramPosts />
    </div>
  );
}
