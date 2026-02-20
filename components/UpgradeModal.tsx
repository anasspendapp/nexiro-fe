import React, { useState, useEffect } from "react";
import { Plan } from "../types";
import { pricingAPI, subscriptionAPI } from "../services/api";
import { authService } from "../services/authService";
import PlanCard from "./PlanCard";

interface UpgradeModalProps {
  onClose: () => void;
  isProcessing: boolean;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({
  onClose,
  isProcessing,
}) => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = authService.getSession();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const data = await pricingAPI.getCurrentPlans();
        setPlans(data.plans.filter((plan: Plan) => plan.isActive));
        setError(null);
      } catch (err) {
        console.error("Failed to fetch credit packages:", err);
        setError("Failed to load credit packages. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleBuyCredits = async (plan: Plan) => {
    if (!user) {
      alert("Please log in to purchase credits");
      return;
    }
    if (!confirm(`Buy ${plan.credits} credits for $${plan.price}?`)) return;

    try {
      const data = await subscriptionAPI.createCheckoutSession({
        email: user.email,
        planId: plan.id,
        successUrl: `${window.location.origin}/?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/`,
      });
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.message || "Failed to start checkout");
      }
    } catch (err) {
      alert("Failed to process credit purchase");
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md animate-fade-in p-4 overflow-y-auto">
      <div className="bg-[#111] border border-white/10 rounded-3xl p-8 max-w-4xl w-full relative shadow-2xl shadow-indigo-500/10 my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white z-20"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="text-center mb-10">
          <h3 className="text-3xl font-bold text-white mb-3">
            Buy More Credits
          </h3>
          <p className="text-gray-400 max-w-lg mx-auto">
            Purchase additional credits to power your product photography
            transformations.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-500 border-r-transparent"></div>
            <p className="mt-4 text-gray-400">Loading credit packages...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plans.map((plan) => {
              const isPro = plan.name.toUpperCase() === "PRO";
              return (
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
                  bestValue={isPro}
                  actionLabel="Buy Credits"
                  onAction={() => handleBuyCredits(plan)}
                  disabled={isProcessing}
                />
              );
            })}
          </div>
        )}

        {isProcessing && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-30 rounded-3xl">
            <svg
              className="animate-spin h-10 w-10 text-indigo-500 mb-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="text-white font-semibold">
              Processing your purchase...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpgradeModal;
