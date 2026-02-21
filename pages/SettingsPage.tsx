import React, { useState, useEffect } from "react";
import { User, PlanType, Plan } from "../types";
import { authService } from "../services/authService";
import { pricingAPI, subscriptionAPI } from "../services/api";
import PlanCard from "../components/PlanCard";
import { useAlert } from "../components/AlertProvider";

interface SettingsPageProps {
  user: User;
  onUpdateUser: (u: User) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ user, onUpdateUser }) => {
  const { alert: showAlert, confirm } = useAlert();
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [planLoading, setPlanLoading] = useState(true);
  const [planError, setPlanError] = useState<string | null>(null);
  const [msg, setMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setPlanLoading(true);
        const data = await pricingAPI.getCurrentPlans();
        setPlans(data.plans.filter((plan: Plan) => plan.isActive));
        setPlanError(null);
      } catch (err) {
        console.error("Failed to fetch pricing plans:", err);
        setPlanError("Failed to load pricing plans. Please try again later.");
      } finally {
        setPlanLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleBuyCredits = async (plan: any) => {
    const approved = await confirm({
      title: "Confirm purchase",
      message: `Buy ${plan.credits} credits for $${plan.price}?`,
      confirmLabel: "Continue",
      cancelLabel: "Cancel",
      variant: "warning",
    });
    if (!approved) return;
    setLoading(true);
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
        await showAlert({
          title: "Checkout failed",
          message: data.message || "Failed to start checkout",
          variant: "error",
        });
      }
      setMsg({ type: "success", text: `Processing your credit purchase...` });
    } catch (err) {
      setMsg({ type: "error", text: "Credit purchase failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 animate-fade-in w-full">
      <h2 className="text-3xl font-bold text-white mb-8">Settings</h2>

      {msg && (
        <div
          className={`mb-6 p-4 rounded-xl border ${
            msg.type === "success"
              ? "bg-green-500/10 border-green-500/30 text-green-400"
              : "bg-red-500/10 border-red-500/30 text-red-400"
          }`}
        >
          {msg.text}
        </div>
      )}

      <div className="grid gap-8">
        {/* Profile Section */}
        <section className="glass-panel p-6 rounded-3xl border border-white/10">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-indigo-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Profile & Security
          </h3>
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Email
            </label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-gray-400 cursor-not-allowed"
            />
          </div>
        </section>

        {/* Buy Credits Section */}
        <section className="glass-panel p-6 rounded-3xl border border-white/10">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-indigo-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
            Buy More Credits
          </h3>

          <div className="mb-8 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider block mb-1">
                Current Balance
              </span>
              <span className="text-3xl font-bold text-white">
                {user.credits}{" "}
                <span className="text-sm font-medium text-gray-400">
                  credits
                </span>
              </span>
            </div>
          </div>

          {planLoading ? (
            <div className="text-center py-8">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-500 border-r-transparent"></div>
              <p className="mt-4 text-gray-400">Loading plans...</p>
            </div>
          ) : planError ? (
            <div className="text-center py-8">
              <p className="text-red-500">{planError}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg"
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
                    actionLabel={"Buy Credits"}
                    onAction={() => handleBuyCredits(plan)}
                    disabled={loading}
                  />
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;
