"use client";

import InstagramUserProfile from "@/components/instagram/InstagramUserProfile";
import InstagramConnect from "@/components/instagram/InstagramConnect";

export default function InstagramProfilePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Instagram Profile
        </h1>
        <p className="text-gray-600">
          View and manage your Instagram profile information.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <InstagramUserProfile />
        </div>
        <div>
          <InstagramConnect />
        </div>
      </div>
    </div>
  );
}
