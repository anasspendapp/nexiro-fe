import React from "react";
import { useNavigate } from "react-router-dom";
import BackgroundBlobs from "../components/BackgroundBlobs";
import Header from "../components/Header";
import Footer from "../components/Footer";

const FeaturesPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: "🎨",
      title: "AI-Powered Enhancement",
      description:
        "Advanced artificial intelligence algorithms automatically enhance your photos with professional-grade quality, adjusting lighting, colors, and details.",
    },
    {
      icon: "⚡",
      title: "Lightning Fast Processing",
      description:
        "Process your images in seconds with our optimized AI engine. No more waiting hours for professional results.",
    },
    {
      icon: "🖼️",
      title: "Multiple Enhancement Tools",
      description:
        "Access a variety of tools including upscaling, background removal, color correction, and creative filters all in one platform.",
    },
    {
      icon: "📱",
      title: "Cross-Platform Access",
      description:
        "Work seamlessly across all your devices. Start editing on desktop and continue on mobile without missing a beat.",
    },
    {
      icon: "🔒",
      title: "Secure & Private",
      description:
        "Your images are encrypted and protected. We prioritize your privacy and never use your photos for training or other purposes.",
    },
    {
      icon: "💎",
      title: "Professional Results",
      description:
        "Get studio-quality results without expensive equipment or software. Perfect for photographers, designers, and content creators.",
    },
    {
      icon: "🎯",
      title: "Batch Processing",
      description:
        "Process multiple images at once with our batch processing feature. Save time on large projects and maintain consistency.",
    },
    {
      icon: "🌟",
      title: "Custom Presets",
      description:
        "Create and save your own enhancement presets for consistent styling across your projects and brand.",
    },
    {
      icon: "📊",
      title: "Analytics Dashboard",
      description:
        "Track your usage, view enhancement history, and manage your projects with an intuitive dashboard interface.",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden flex flex-col">
      <BackgroundBlobs />

      <Header showAuth={true} showNavLinks={true} />

      {/* Hero Section */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 pt-20 pb-12">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Powerful Features for
            <br />
            Professional Results
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Discover the comprehensive suite of AI-powered tools designed to
            transform your photography workflow.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-indigo-500/50 transition-all hover:scale-105"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Images?
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Join thousands of creators who trust Nexiro for their image
            enhancement needs.
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-lg text-lg font-medium transition-all hover:scale-105"
          >
            Start Enhancing Now
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FeaturesPage;
