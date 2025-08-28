"use client";

import InstagramConnect from "@/components/instagram/InstagramConnect";
import InstagramUserProfile from "@/components/instagram/InstagramUserProfile";

export default function InstagramDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Instagram Dashboard
        </h1>
        <p className="text-gray-600">
          Manage your Instagram account, view posts, and access analytics.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <InstagramConnect />
        <InstagramUserProfile />
      </div>
    </div>
  );
}
