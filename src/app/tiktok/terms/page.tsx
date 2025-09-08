"use client";

import {
  ArrowLeft,
  FileText,
  Shield,
  Users,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";

export default function TikTokTermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
          </div>
          <div className="mt-4">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <FileText className="w-8 h-8 mr-3 text-black" />
              TikTok Terms of Service
            </h1>
            <p className="text-gray-600 mt-2">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="prose prose-lg max-w-none">
            {/* Introduction */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Shield className="w-6 h-6 mr-2 text-black" />
                1. Introduction
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Welcome to SocialEdge's TikTok integration service. These Terms
                of Service ("Terms") govern your use of our TikTok-related
                features and services. By using our TikTok integration, you
                agree to be bound by these Terms and our Privacy Policy.
              </p>
            </section>

            {/* Acceptance of Terms */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Users className="w-6 h-6 mr-2 text-black" />
                2. Acceptance of Terms
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                By accessing or using our TikTok integration services, you
                acknowledge that you have read, understood, and agree to be
                bound by these Terms. If you do not agree to these Terms, please
                do not use our TikTok services.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
                  <p className="text-yellow-800 text-sm">
                    <strong>Important:</strong> These Terms are in addition to
                    TikTok's own Terms of Service and Community Guidelines. You
                    must comply with both sets of terms.
                  </p>
                </div>
              </div>
            </section>

            {/* Service Description */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                3. Service Description
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our TikTok integration service provides the following features:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Connect your TikTok account to SocialEdge</li>
                <li>View and manage your TikTok content</li>
                <li>Access analytics and performance metrics</li>
                <li>Generate AI-powered content suggestions</li>
                <li>Schedule and publish content to TikTok</li>
                <li>Monitor engagement and audience insights</li>
              </ul>
            </section>

            {/* User Responsibilities */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                4. User Responsibilities
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                As a user of our TikTok integration, you agree to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>
                  Provide accurate and complete information when connecting your
                  TikTok account
                </li>
                <li>Maintain the security of your account credentials</li>
                <li>
                  Comply with TikTok's Terms of Service and Community Guidelines
                </li>
                <li>
                  Not use our service for any illegal or unauthorized purposes
                </li>
                <li>Respect intellectual property rights of others</li>
                <li>Not attempt to circumvent any security measures</li>
                <li>
                  Report any security vulnerabilities or suspicious activity
                </li>
              </ul>
            </section>

            {/* Content Guidelines */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                5. Content Guidelines
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                All content created, shared, or managed through our TikTok
                integration must comply with:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>TikTok's Community Guidelines</li>
                <li>Applicable local, state, and federal laws</li>
                <li>Our content policies and standards</li>
                <li>Respect for others' rights and dignity</li>
              </ul>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                <p className="text-red-800 text-sm">
                  <strong>Prohibited Content:</strong> We do not allow content
                  that is harmful, illegal, defamatory, or violates TikTok's
                  policies. Violations may result in immediate termination of
                  service.
                </p>
              </div>
            </section>

            {/* Data and Privacy */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                6. Data and Privacy
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We are committed to protecting your privacy and data. Our data
                practices include:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Secure storage and transmission of your TikTok data</li>
                <li>Limited access to your data for service provision only</li>
                <li>Compliance with applicable data protection laws</li>
                <li>Regular security audits and updates</li>
                <li>Transparent data usage policies</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                For detailed information about how we collect, use, and protect
                your data, please review our{" "}
                <Link
                  href="/tiktok/policy"
                  className="text-black hover:underline"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </section>

            {/* Service Availability */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                7. Service Availability
              </h2>
              <p className="text-gray-700 leading-relaxed">
                While we strive to provide reliable service, we cannot guarantee
                uninterrupted access to our TikTok integration. Service may be
                temporarily unavailable due to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mt-4">
                <li>Scheduled maintenance and updates</li>
                <li>Technical issues or system failures</li>
                <li>Changes to TikTok's API or policies</li>
                <li>Force majeure events</li>
              </ul>
            </section>

            {/* Termination */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                8. Termination
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Either party may terminate this agreement at any time. Upon
                termination:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mt-4">
                <li>
                  Your access to TikTok integration features will be revoked
                </li>
                <li>We will securely delete your TikTok data within 30 days</li>
                <li>You remain responsible for any outstanding obligations</li>
                <li>
                  Certain provisions of these Terms will survive termination
                </li>
              </ul>
            </section>

            {/* Limitation of Liability */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                9. Limitation of Liability
              </h2>
              <p className="text-gray-700 leading-relaxed">
                To the maximum extent permitted by law, SocialEdge shall not be
                liable for any indirect, incidental, special, consequential, or
                punitive damages arising from your use of our TikTok integration
                services.
              </p>
            </section>

            {/* Changes to Terms */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                10. Changes to Terms
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to modify these Terms at any time. We will
                notify users of significant changes via email or through our
                service. Continued use of our TikTok integration after changes
                constitutes acceptance of the new Terms.
              </p>
            </section>

            {/* Contact Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                11. Contact Information
              </h2>
              <p className="text-gray-700 leading-relaxed">
                If you have any questions about these Terms, please contact us
                at:
              </p>
              <div className="bg-gray-50 rounded-lg p-4 mt-4">
                <p className="text-gray-700">
                  <strong>Email:</strong> legal@socialedge.com
                  <br />
                  <strong>Address:</strong> SocialEdge Legal Department
                  <br />
                  <strong>Phone:</strong> +1 (555) 123-4567
                </p>
              </div>
            </section>

            {/* Footer */}
            <div className="border-t pt-8 mt-8">
              <p className="text-gray-500 text-sm text-center">
                © 2024 SocialEdge. All rights reserved. These Terms of Service
                are effective as of the date listed above.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
