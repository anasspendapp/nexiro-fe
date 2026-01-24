import React from "react";
import BackgroundBlobs from "../components/BackgroundBlobs";
import Header from "../components/Header";
import Footer from "../components/Footer";

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden flex flex-col">
      <BackgroundBlobs />

      <Header showAuth={true} showNavLinks={true} />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">
        <div className="animate-fade-in">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <p className="text-gray-400 mb-12">Last updated: January 24, 2026</p>

          <div className="space-y-8 text-gray-300">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">
                1. Introduction
              </h2>
              <p className="leading-relaxed">
                Welcome to Nexiro AI ("we," "our," or "us"). We are committed to
                protecting your personal information and your right to privacy.
                This Privacy Policy explains how we collect, use, disclose, and
                safeguard your information when you use our AI photography
                enhancement service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">
                2. Information We Collect
              </h2>
              <div className="space-y-3">
                <div>
                  <h3 className="text-xl font-medium mb-2 text-indigo-400">
                    Personal Information
                  </h3>
                  <p className="leading-relaxed">
                    We collect information that you provide directly to us,
                    including your name, email address, and payment information
                    when you create an account or subscribe to our services.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2 text-indigo-400">
                    Usage Data
                  </h3>
                  <p className="leading-relaxed">
                    We automatically collect certain information about your
                    device and how you interact with our service, including IP
                    address, browser type, pages visited, and usage patterns.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2 text-indigo-400">
                    Image Data
                  </h3>
                  <p className="leading-relaxed">
                    Images you upload to Nexiro are processed by our AI systems
                    to provide enhancement services. We do not use your images
                    to train our AI models or for any purpose other than
                    providing you with our services.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">
                3. How We Use Your Information
              </h2>
              <ul className="list-disc list-inside space-y-2 leading-relaxed">
                <li>To provide, maintain, and improve our services</li>
                <li>To process your transactions and manage your account</li>
                <li>To communicate with you about updates and promotions</li>
                <li>To detect, prevent, and address technical issues</li>
                <li>To comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">
                4. Data Security
              </h2>
              <p className="leading-relaxed">
                We implement appropriate technical and organizational measures
                to protect your personal information against unauthorized
                access, alteration, disclosure, or destruction. All uploaded
                images are encrypted in transit and at rest. However, no method
                of transmission over the Internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">
                5. Data Retention
              </h2>
              <p className="leading-relaxed">
                We retain your personal information for as long as your account
                is active or as needed to provide you services. Uploaded images
                are automatically deleted from our servers after 30 days unless
                you choose to save them permanently in your account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">
                6. Your Rights
              </h2>
              <p className="leading-relaxed mb-3">You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 leading-relaxed">
                <li>Access your personal information</li>
                <li>Correct inaccurate or incomplete data</li>
                <li>Request deletion of your data</li>
                <li>Object to or restrict certain processing</li>
                <li>Data portability</li>
                <li>Withdraw consent at any time</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">
                7. Third-Party Services
              </h2>
              <p className="leading-relaxed">
                We use trusted third-party services for payment processing
                (Stripe) and analytics. These services have their own privacy
                policies and we encourage you to review them.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">
                8. Changes to This Policy
              </h2>
              <p className="leading-relaxed">
                We may update this Privacy Policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy on
                this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">
                9. Contact Us
              </h2>
              <p className="leading-relaxed">
                If you have any questions about this Privacy Policy, please
                contact us at:{" "}
                <a
                  href="mailto:privacy@nexiro.ai"
                  className="text-indigo-400 hover:text-indigo-300"
                >
                  privacy@nexiro.ai
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

export default PrivacyPolicyPage;
