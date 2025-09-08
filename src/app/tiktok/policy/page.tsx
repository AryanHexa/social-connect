"use client";

import {
  ArrowLeft,
  Shield,
  Eye,
  Lock,
  Database,
  Users,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

export default function TikTokPolicyPage() {
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
              <Shield className="w-8 h-8 mr-3 text-black" />
              TikTok Privacy Policy
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
                <Eye className="w-6 h-6 mr-2 text-black" />
                1. Introduction
              </h2>
              <p className="text-gray-700 leading-relaxed">
                At SocialEdge, we are committed to protecting your privacy and
                ensuring the security of your personal information. This Privacy
                Policy explains how we collect, use, disclose, and safeguard
                your information when you use our TikTok integration services.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                  <p className="text-blue-800 text-sm">
                    <strong>Your Privacy Matters:</strong> We follow industry
                    best practices and comply with applicable data protection
                    laws to keep your information secure.
                  </p>
                </div>
              </div>
            </section>

            {/* Information We Collect */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Database className="w-6 h-6 mr-2 text-black" />
                2. Information We Collect
              </h2>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                2.1 TikTok Account Information
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                When you connect your TikTok account, we collect:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-6">
                <li>Your TikTok username and display name</li>
                <li>Profile information (bio, follower count, etc.)</li>
                <li>Access tokens for API integration</li>
                <li>Content metadata (posts, videos, engagement data)</li>
                <li>Analytics and performance metrics</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                2.2 Usage Information
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We automatically collect information about how you use our
                TikTok integration:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-6">
                <li>Feature usage patterns and preferences</li>
                <li>Content creation and scheduling activities</li>
                <li>Analytics viewing and export actions</li>
                <li>Error logs and performance data</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                2.3 Technical Information
              </h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Device information and browser type</li>
                <li>IP address and location data (anonymized)</li>
                <li>Session data and cookies</li>
                <li>API request logs and response times</li>
              </ul>
            </section>

            {/* How We Use Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Users className="w-6 h-6 mr-2 text-black" />
                3. How We Use Your Information
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use the collected information for the following purposes:
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-2">
                    Service Provision
                  </h4>
                  <ul className="text-green-700 text-sm space-y-1">
                    <li>• Connect and sync your TikTok account</li>
                    <li>• Display your content and analytics</li>
                    <li>• Provide AI-powered content suggestions</li>
                    <li>• Enable content scheduling and publishing</li>
                  </ul>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">
                    Service Improvement
                  </h4>
                  <ul className="text-blue-700 text-sm space-y-1">
                    <li>• Analyze usage patterns and preferences</li>
                    <li>• Improve our algorithms and features</li>
                    <li>• Optimize performance and reliability</li>
                    <li>• Develop new functionality</li>
                  </ul>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-800 mb-2">
                    Communication
                  </h4>
                  <ul className="text-purple-700 text-sm space-y-1">
                    <li>• Send service updates and notifications</li>
                    <li>• Provide customer support</li>
                    <li>• Share important policy changes</li>
                    <li>• Respond to your inquiries</li>
                  </ul>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h4 className="font-semibold text-orange-800 mb-2">
                    Security & Compliance
                  </h4>
                  <ul className="text-orange-700 text-sm space-y-1">
                    <li>• Monitor for security threats</li>
                    <li>• Prevent fraud and abuse</li>
                    <li>• Comply with legal obligations</li>
                    <li>• Enforce our terms of service</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Data Sharing */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Lock className="w-6 h-6 mr-2 text-black" />
                4. Information Sharing and Disclosure
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We do not sell, trade, or rent your personal information to
                third parties. We may share your information only in the
                following limited circumstances:
              </p>

              <div className="space-y-4">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Service Providers
                  </h4>
                  <p className="text-gray-700 text-sm">
                    We may share information with trusted third-party service
                    providers who assist us in operating our platform, such as
                    cloud hosting, analytics, and customer support services.
                  </p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Legal Requirements
                  </h4>
                  <p className="text-gray-700 text-sm">
                    We may disclose information when required by law, court
                    order, or to protect our rights, property, or safety, or
                    that of our users.
                  </p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Business Transfers
                  </h4>
                  <p className="text-gray-700 text-sm">
                    In the event of a merger, acquisition, or sale of assets,
                    user information may be transferred as part of the
                    transaction.
                  </p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Consent</h4>
                  <p className="text-gray-700 text-sm">
                    We may share information with your explicit consent for
                    specific purposes not covered in this policy.
                  </p>
                </div>
              </div>
            </section>

            {/* Data Security */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Shield className="w-6 h-6 mr-2 text-black" />
                5. Data Security
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We implement comprehensive security measures to protect your
                information:
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-gray-700">End-to-end encryption</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-gray-700">
                      Secure API connections (HTTPS)
                    </span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-gray-700">
                      Regular security audits
                    </span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-gray-700">
                      Access controls and monitoring
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-gray-700">
                      Data backup and recovery
                    </span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-gray-700">
                      Employee training and policies
                    </span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-gray-700">
                      Incident response procedures
                    </span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-gray-700">
                      Compliance with industry standards
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Your Rights */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                6. Your Rights and Choices
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                You have the following rights regarding your personal
                information:
              </p>

              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-gray-800">
                    Access and Portability
                  </h4>
                  <p className="text-gray-700 text-sm">
                    Request a copy of your personal data and export it in a
                    machine-readable format.
                  </p>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold text-gray-800">
                    Correction and Updates
                  </h4>
                  <p className="text-gray-700 text-sm">
                    Update or correct inaccurate personal information in your
                    account.
                  </p>
                </div>

                <div className="border-l-4 border-yellow-500 pl-4">
                  <h4 className="font-semibold text-gray-800">
                    Deletion and Restriction
                  </h4>
                  <p className="text-gray-700 text-sm">
                    Request deletion of your personal data or restriction of its
                    processing.
                  </p>
                </div>

                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-semibold text-gray-800">
                    Objection and Withdrawal
                  </h4>
                  <p className="text-gray-700 text-sm">
                    Object to certain processing activities or withdraw your
                    consent.
                  </p>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
                  <p className="text-yellow-800 text-sm">
                    <strong>Exercise Your Rights:</strong> To exercise any of
                    these rights, please contact us at privacy@socialedge.com.
                    We will respond to your request within 30 days.
                  </p>
                </div>
              </div>
            </section>

            {/* Data Retention */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                7. Data Retention
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We retain your personal information only as long as necessary to
                provide our services and fulfill the purposes outlined in this
                policy:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>
                  <strong>Account Data:</strong> Retained while your account is
                  active and for 30 days after deletion
                </li>
                <li>
                  <strong>TikTok Content:</strong> Cached for up to 24 hours for
                  performance optimization
                </li>
                <li>
                  <strong>Analytics Data:</strong> Retained for up to 2 years
                  for trend analysis
                </li>
                <li>
                  <strong>Log Data:</strong> Retained for up to 90 days for
                  security and debugging
                </li>
                <li>
                  <strong>Legal Requirements:</strong> Some data may be retained
                  longer if required by law
                </li>
              </ul>
            </section>

            {/* Third-Party Services */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                8. Third-Party Services
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our TikTok integration connects with TikTok's services. Please
                note:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>TikTok has its own privacy policy and data practices</li>
                <li>We only access data that you explicitly authorize</li>
                <li>We do not control TikTok's data collection or usage</li>
                <li>
                  You can revoke our access through your TikTok account settings
                </li>
              </ul>
            </section>

            {/* International Transfers */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                9. International Data Transfers
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Your information may be transferred to and processed in
                countries other than your own. We ensure appropriate safeguards
                are in place for such transfers, including standard contractual
                clauses and adequacy decisions where applicable.
              </p>
            </section>

            {/* Children's Privacy */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                10. Children's Privacy
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Our services are not intended for children under 13 years of
                age. We do not knowingly collect personal information from
                children under 13. If you believe we have collected information
                from a child under 13, please contact us immediately.
              </p>
            </section>

            {/* Changes to Policy */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                11. Changes to This Privacy Policy
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We may update this Privacy Policy from time to time. We will
                notify you of any material changes by email or through our
                service. Your continued use of our TikTok integration after
                changes constitutes acceptance of the updated policy.
              </p>
            </section>

            {/* Contact Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                12. Contact Us
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions about this Privacy Policy or our data
                practices, please contact us:
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700">
                  <strong>Privacy Officer:</strong> privacy@socialedge.com
                  <br />
                  <strong>Data Protection Officer:</strong> dpo@socialedge.com
                  <br />
                  <strong>General Inquiries:</strong> support@socialedge.com
                  <br />
                  <strong>Address:</strong> SocialEdge Privacy Team
                  <br />
                  <strong>Phone:</strong> +1 (555) 123-4567
                </p>
              </div>
            </section>

            {/* Footer */}
            <div className="border-t pt-8 mt-8">
              <p className="text-gray-500 text-sm text-center">
                © 2024 SocialEdge. All rights reserved. This Privacy Policy is
                effective as of the date listed above.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
