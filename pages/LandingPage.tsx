import React, { useState, useEffect } from "react";
import BackgroundBlobs from "../components/BackgroundBlobs";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PlanCard from "../components/PlanCard";
import { useNavigate } from "react-router-dom";
import { pricingAPI } from "../services/api";
import { Plan } from "../types";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const data = await pricingAPI.getCurrentPlans();
        setPlans(data.plans.filter((plan: Plan) => plan.isActive));
      } catch (err) {
        console.error("Failed to fetch pricing plans:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  return (
    <div className="relative overflow-hidden bg-black text-white flex flex-col min-h-screen">
      <BackgroundBlobs />

      <Header />

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-20">
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
          <div className="relative flex-1">
            <button className="w-full py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-xl backdrop-blur-sm transition-all relative">
              View Showcase
            </button>
            <span className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
              Coming Soon
            </span>
          </div>
        </div>
      </section>

      {/* Free Credits Section */}
      <section className="relative z-10 px-6 py-16 max-w-5xl mx-auto w-full">
        <div className="glass-panel p-8 md:p-12 text-center rounded-2xl">
          <div className="inline-block mb-4 px-4 py-2 bg-green-500/20 border border-green-500/50 rounded-full">
            <span className="text-green-400 text-sm font-bold">New Users</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Free Credits to Get Started
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-6">
            Start learning and exploring Nexiro's powerful AI photography
            features without any payment. Sign up to receive free credits and
            experiment with our advanced tools to discover what's possible with
            your images.
          </p>
          <p className="text-gray-300">
            No credit card required to get started. Upgrade anytime as you
            create more stunning visuals.
          </p>
        </div>
      </section>

      {/* Plans Section */}
      <section className="relative z-10 px-6 py-20 max-w-6xl mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Choose the plan that fits your creative needs. All plans include API
            access for seamless integration.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-500 border-r-transparent"></div>
            <p className="mt-4 text-gray-400">Loading plans...</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 gap-8">
              {plans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  name={plan.name}
                  price={parseFloat(plan.price).toFixed(2)}
                  credits={plan.credits}
                  features={
                    plan.description
                      ? [plan.description]
                      : ["No description available"]
                  }
                  bestValue={plan.name.toUpperCase() === "PRO"}
                  onAction={() => navigate("/auth")}
                  actionLabel="Get Started"
                />
              ))}
            </div>

            <div className="mt-12 p-6 bg-white/5 border border-white/10 rounded-xl text-center">
              <p className="text-gray-300">
                <span className="font-bold text-white">
                  Need something custom?
                </span>{" "}
                Contact our sales team for enterprise solutions with dedicated
                support and custom pricing.
              </p>
            </div>
          </>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
