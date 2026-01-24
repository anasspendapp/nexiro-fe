import React from "react";

const Footer = () => (
  <footer className="border-t border-white/5 bg-black/40 backdrop-blur-xl mt-auto relative z-10 w-full">
    <div className="max-w-[1600px] mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">
            Nex<span className="text-indigo-400">iro</span>
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Professional AI photography enhancement tool. Transform your
            creative visions into reality.
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Product</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>
              <a
                href="/features"
                className="hover:text-indigo-400 transition-colors"
              >
                Features
              </a>
            </li>
            <li>
              <a
                href="/pricing"
                className="hover:text-indigo-400 transition-colors"
              >
                Pricing
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Legal</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>
              <a
                href="/privacy"
                className="hover:text-indigo-400 transition-colors"
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="/terms"
                className="hover:text-indigo-400 transition-colors"
              >
                Terms of Service
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="pt-8 border-t border-white/5 text-center text-gray-500 text-xs">
        © 2024 Nexiro AI. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
