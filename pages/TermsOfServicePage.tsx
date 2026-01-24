import React from "react";
import BackgroundBlobs from "../components/BackgroundBlobs";
import Header from "../components/Header";
import Footer from "../components/Footer";

const TermsOfServicePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden flex flex-col">
      <BackgroundBlobs />

      <Header showAuth={true} showNavLinks={true} />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">
        <div className="animate-fade-in">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Terms of Service
          </h1>
          <p className="text-gray-400 mb-12">Last updated: January 24, 2026</p>

          <div className="space-y-8 text-gray-300">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">
                1. Acceptance of Terms
              </h2>
              <p className="leading-relaxed">
                By accessing and using Nexiro AI ("Service"), you accept and
                agree to be bound by the terms and provision of this agreement.
                If you do not agree to these Terms of Service, please do not use
                our Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">
                2. Description of Service
              </h2>
              <p className="leading-relaxed">
                Nexiro AI provides AI-powered photography enhancement tools
                including but not limited to image upscaling, background
                removal, color correction, and creative filters. The Service is
                available through a web-based platform accessible via various
                devices.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">
                3. User Accounts
              </h2>
              <div className="space-y-3 leading-relaxed">
                <p>
                  To access certain features of the Service, you must create an
                  account. You agree to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    Provide accurate, current, and complete information during
                    registration
                  </li>
                  <li>Maintain and promptly update your account information</li>
                  <li>Maintain the security of your password and account</li>
                  <li>
                    Accept responsibility for all activities under your account
                  </li>
                  <li>
                    Notify us immediately of any unauthorized use of your
                    account
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">
                4. Subscription and Payment
              </h2>
              <div className="space-y-3">
                <div>
                  <h3 className="text-xl font-medium mb-2 text-indigo-400">
                    Subscription Plans
                  </h3>
                  <p className="leading-relaxed">
                    We offer various subscription tiers (Free, Pro, Enterprise)
                    with different features and usage limits. Paid subscriptions
                    are billed on a monthly or annual basis.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2 text-indigo-400">
                    Billing
                  </h3>
                  <p className="leading-relaxed">
                    All fees are in USD and non-refundable except as required by
                    law. Subscriptions automatically renew unless cancelled
                    before the renewal date.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2 text-indigo-400">
                    Cancellation
                  </h3>
                  <p className="leading-relaxed">
                    You may cancel your subscription at any time. You will
                    continue to have access until the end of your billing
                    period.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">
                5. User Content and Ownership
              </h2>
              <div className="space-y-3 leading-relaxed">
                <p>
                  You retain all rights to the images you upload to the Service.
                  By uploading content, you grant Nexiro AI a limited license to
                  process your images solely for the purpose of providing the
                  Service.
                </p>
                <p>We do not:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Claim ownership of your uploaded images</li>
                  <li>Use your images to train our AI models</li>
                  <li>
                    Share your images with third parties without your consent
                  </li>
                  <li>Use your images for marketing purposes</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">
                6. Acceptable Use
              </h2>
              <div className="space-y-3 leading-relaxed">
                <p>You agree not to use the Service to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Upload illegal, harmful, or offensive content</li>
                  <li>Violate any applicable laws or regulations</li>
                  <li>Infringe upon intellectual property rights of others</li>
                  <li>Attempt to gain unauthorized access to the Service</li>
                  <li>Interfere with or disrupt the Service</li>
                  <li>Use automated tools to scrape or abuse the Service</li>
                  <li>Impersonate others or provide false information</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">
                7. Intellectual Property
              </h2>
              <p className="leading-relaxed">
                The Service, including its original content, features, and
                functionality, is owned by Nexiro AI and is protected by
                international copyright, trademark, patent, trade secret, and
                other intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">
                8. Disclaimer of Warranties
              </h2>
              <p className="leading-relaxed">
                The Service is provided "as is" and "as available" without
                warranties of any kind, either express or implied. We do not
                guarantee that the Service will be uninterrupted, secure, or
                error-free.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">
                9. Limitation of Liability
              </h2>
              <p className="leading-relaxed">
                To the maximum extent permitted by law, Nexiro AI shall not be
                liable for any indirect, incidental, special, consequential, or
                punitive damages resulting from your use of or inability to use
                the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">
                10. Termination
              </h2>
              <p className="leading-relaxed">
                We may terminate or suspend your account and access to the
                Service immediately, without prior notice, for any reason,
                including breach of these Terms. Upon termination, your right to
                use the Service will immediately cease.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">
                11. Changes to Terms
              </h2>
              <p className="leading-relaxed">
                We reserve the right to modify these Terms at any time. We will
                provide notice of significant changes by posting the new Terms
                and updating the "Last updated" date. Continued use of the
                Service after changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">
                12. Governing Law
              </h2>
              <p className="leading-relaxed">
                These Terms shall be governed by and construed in accordance
                with the laws of the jurisdiction in which Nexiro AI operates,
                without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">
                13. Contact Information
              </h2>
              <p className="leading-relaxed">
                For questions about these Terms, please contact us at:{" "}
                <a
                  href="mailto:legal@nexiro.ai"
                  className="text-indigo-400 hover:text-indigo-300"
                >
                  legal@nexiro.ai
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TermsOfServicePage;
