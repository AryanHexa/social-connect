'use client';

import ContentGenerator from '@/components/x/ContentGenerator';

export default function ContentPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Content Generator</h1>
        <p className="text-gray-600">
          Generate engaging social media content using AI. Customize your content based on your niche and audience.
        </p>
      </div>

      <ContentGenerator />
    </div>
  );
}
