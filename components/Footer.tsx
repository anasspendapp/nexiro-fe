import {
  Twitter,
  Linkedin,
  Instagram,
  Facebook,
  ArrowRight,
} from "lucide-react";
import logoImg from "@/images/logo.png";

interface NavLink {
  label: string;
  href: string;
  coming_soon?: boolean;
}

interface NavSection {
  title: string;
  links: NavLink[];
}

const Footer = () => {
  const navSections: NavSection[] = [
    {
      title: "Product",
      links: [
        { label: "Features", href: "/#features" },
        { label: "Pricing", href: "/#pricing" },
        { label: "How it works", href: "/#how-it-works" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", coming_soon: true, href: "#" },
        { label: "Blog", coming_soon: true, href: "#" },
        { label: "Careers", coming_soon: true, href: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Documentation", coming_soon: true, href: "#" },
        { label: "Support", coming_soon: true, href: "#" },
        { label: "API", coming_soon: true, href: "#" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
        { label: "Cookies", coming_soon: true, href: "#" },
      ],
    },
  ];

  return (
    <footer className="bg-black border-t border-white/5 pt-20 md:pt-24 pb-12 md:pb-16 px-4 md:px-8 selection:bg-indigo-500 selection:text-white">
      <div className="max-w-[1400px] mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 md:gap-8 mb-12 md:mb-20">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="mb-6">
              <img
                src={logoImg}
                alt="Nexiro"
                className="h-8 md:h-10 hover:opacity-80 transition-opacity duration-200"
              />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              AI-powered image enhancement for modern brands.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.twitter.com/nexiroai"
                aria-label="Twitter"
                className="text-gray-500 hover:text-indigo-400 transition-colors duration-200"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/nexiroai"
                aria-label="Instagram"
                className="text-gray-500 hover:text-indigo-400 transition-colors duration-200"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.facebook.com/nexiroai"
                aria-label="Facebook"
                className="text-gray-500 hover:text-indigo-400 transition-colors duration-200"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/company/nexiro"
                aria-label="LinkedIn"
                className="text-gray-500 hover:text-indigo-400 transition-colors duration-200"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Navigation Sections */}
          {navSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-white font-semibold text-sm uppercase tracking-wide mb-5">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {link.coming_soon ? (
                      <div className="flex items-center gap-2 text-gray-600">
                        <span className="text-sm">{link.label}</span>
                        <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded">
                          Coming soon
                        </span>
                      </div>
                    ) : (
                      <a
                        href={link.href}
                        className="text-gray-400 hover:text-indigo-400 text-sm transition-colors duration-200 flex items-center gap-1 group"
                      >
                        {link.label}
                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer Divider */}
        <div className="border-t border-white/5 pt-8 md:pt-12">
          {/* Footer Bottom */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
            <p>© 2026 Nexiro Inc. All rights reserved.</p>
            <div className="flex gap-6">
              <a
                href="/privacy"
                className="hover:text-gray-300 transition-colors"
              >
                Privacy Policy
              </a>
              <span className="text-white/10">•</span>
              <a
                href="/terms"
                className="hover:text-gray-300 transition-colors"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
