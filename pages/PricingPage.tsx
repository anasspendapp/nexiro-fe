import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { subscriptionAPI, pricingAPI } from "../services/api";
import { Plan } from "../types";
import PlanCard from "../components/PlanCard";
import BackgroundBlobs from "../components/BackgroundBlobs";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAlert } from "../components/AlertProvider";

const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const { alert: showAlert } = useAlert();
  const user = authService.getSession();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const data = await pricingAPI.getCurrentPlans();
        setPlans(data.plans.filter((plan: Plan) => plan.isActive));
        setError(null);
      } catch (err) {
        console.error("Failed to fetch pricing plans:", err);
        setError("Failed to load pricing plans. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleStripeCheckout = async (planId: string) => {
    if (!user) {
      navigate("/auth");
      return;
    }
    console.log("Initiating Checkout for Plan:", planId);
    if (!planId) {
      await showAlert({
        title: "Missing plan",
        message: "Plan ID is missing. Please refresh and try again.",
        variant: "error",
      });
      return;
    }
    try {
      const data = await subscriptionAPI.createCheckoutSession({
        planId,
        email: user.email,
        successUrl: `${window.location.origin}/?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/`,
      });
      if (data.url) {
        window.location.href = data.url;
      } else {
        await showAlert({
          title: "Checkout failed",
          message: data.message || "Failed to start checkout",
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Checkout error:", error);
      await showAlert({
        title: "Checkout failed",
        message: "Checkout failed",
        variant: "error",
      });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden flex flex-col">
      <BackgroundBlobs />

      <Header />

      <div className="relative z-10 max-w-5xl w-full mx-auto p-6 flex-grow flex flex-col items-center justify-center animate-fade-in">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-4">Select Your Plan</h2>
          <p className="text-gray-400">
            Choose the plan that fits your creative needs.
          </p>
        </div>

        {/* Pricing Explanation Section */}
        <div className="w-full max-w-4xl mx-auto mb-12 bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-2xl p-8 backdrop-blur-sm">
          <h3 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Credit Usage Guide
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Prompt Based Images */}
            <div className="bg-black/30 rounded-xl p-6 border border-purple-500/20">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mr-3">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-purple-300">
                  Prompt Based Images
                </h4>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">1K, 2K Quality</span>
                  <span className="px-3 py-1 bg-purple-500/20 rounded-full text-purple-300 font-semibold">
                    2 Credits
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">4K Quality</span>
                  <span className="px-3 py-1 bg-purple-500/20 rounded-full text-purple-300 font-semibold">
                    8 Credits
                  </span>
                </div>
              </div>
            </div>

            {/* Reference Based Images */}
            <div className="bg-black/30 rounded-xl p-6 border border-blue-500/20">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mr-3">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-blue-300">
                  Reference Based Images
                </h4>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">1K, 2K Quality</span>
                  <span className="px-3 py-1 bg-blue-500/20 rounded-full text-blue-300 font-semibold">
                    4 Credits
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">4K Quality</span>
                  <span className="px-3 py-1 bg-blue-500/20 rounded-full text-blue-300 font-semibold">
                    10 Credits
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-500 border-r-transparent"></div>
            <p className="mt-4 text-gray-400">Loading plans...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan, index) => (
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
                onSelect={() => handleStripeCheckout(plan.id)}
                selected={false}
                bestValue={plan.name.toUpperCase() === "PRO"}
                actionLabel={`Get ${plan.name}`}
                onAction={() => handleStripeCheckout(plan.id)}
              />
            ))}
          </div>
        )}

        <div className="mt-8 text-center text-gray-500 text-sm">
          <button
            onClick={() => navigate("/")}
            className="underline hover:text-gray-400"
          >
            Back to Login
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PricingPage;
