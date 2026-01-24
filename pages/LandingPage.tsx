import React from "react";
import BackgroundBlobs from "../components/BackgroundBlobs";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden bg-black text-white flex flex-col">
      <BackgroundBlobs />

      <Header showAuth={true} showNavLinks={true} />

      {/* Hero */}
      <main className="relative z-10 flex-grow flex flex-col items-center justify-center text-center px-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm animate-fade-in-up">
          <span className="flex h-2 w-2 rounded-full bg-green-400"></span>
          <span className="text-xs font-medium text-gray-300">
            Gemini 3 Pro + 8K Rendering
          </span>
        </div>

        <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-8 max-w-4xl bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
          AI Photography <br /> for Professionals.
        </h1>

        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-12 leading-relaxed">
          Transform casual snapshots into commercial-grade product and food
          photography. Controlled lighting, material physics, and 8K fidelity.
        </p>

        <div className="flex flex-col md:flex-row gap-4 w-full max-w-md">
          <button
            onClick={() => navigate("/auth")}
            className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25 transition-all transform hover:scale-105"
          >
            Start Creating Free
          </button>
          <button className="flex-1 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-xl backdrop-blur-sm transition-all">
            View Showcase
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
