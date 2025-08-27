"use client";

import React from "react";
import ContentGenerator from "@/components/x/ContentGenerator";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

export default function TwitterContentPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Twitter Content Generator
        </h1>
        <p className="text-gray-600">
          Generate engaging Twitter content using AI.
        </p>
      </div>

      {/* Content Generator */}
      <ErrorBoundary>
        <ContentGenerator />
      </ErrorBoundary>
    </div>
  );
}
