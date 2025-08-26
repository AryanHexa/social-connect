"use client";

import TwitterUserProfile from "@/components/x/TwitterUserProfile";
import TwitterConnect from "@/components/x/TwitterConnect";

export default function TwitterProfilePage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Twitter Profile
        </h1>
        <p className="text-gray-600">
          Connect your Twitter account and view your profile information.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TwitterUserProfile />
        <TwitterConnect />
      </div>
    </div>
  );
}
