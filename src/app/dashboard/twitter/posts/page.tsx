'use client';

import TwitterPosts from '@/components/x/TwitterPosts';

export default function TwitterPostsPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Twitter Posts</h1>
        <p className="text-gray-600">
          View and manage your Twitter posts. Sync with Twitter to get the latest posts.
        </p>
      </div>

      <TwitterPosts limit={20} />
    </div>
  );
}
