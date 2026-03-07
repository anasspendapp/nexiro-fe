import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plan } from "@/types";
import { pricingAPI } from "@/services/api";
import { fadeUpVariants, staggerContainer } from "./animationVariants";

interface CreditCalculatorProps {
  plans: Plan[];
}

const CreditCalculator: React.FC<CreditCalculatorProps> = ({ plans }) => {
  const [type, setType] = useState<"prompt" | "reference">("prompt");
  const [quality, setQuality] = useState<"standard" | "high">("standard");
  const [quantity, setQuantity] = useState(1);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);

  useEffect(() => {
    if (plans && plans.length > 0 && selectedPlanId === null) {
      setSelectedPlanId(plans[0].id);
    }
  }, [plans, selectedPlanId]);

  let costPerImage = type === "reference" ? 4 : 2;
  if (quality === "high") {
    costPerImage = type === "reference" ? 10 : 8;
  }

  const totalCredits = costPerImage * quantity;

  const selectedPlan =
    plans?.find((p) => p.id === selectedPlanId) || plans?.[0];
  const costPerCredit = selectedPlan
    ? parseFloat(selectedPlan.price) / selectedPlan.credits
    : 0;

  const dollarTotalCost = (totalCredits * costPerCredit).toFixed(2);
  const dollarCostPerImage = (costPerImage * costPerCredit).toFixed(2);

  const studioCost = quantity * 20;
  const savings = (studioCost - parseFloat(dollarTotalCost)).toFixed(2);

  return (
    <motion.div
      variants={fadeUpVariants}
      className="mt-16 md:mt-24 max-w-[800px] mx-auto p-6 md:p-10 rounded-2xl border border-white/10 bg-[#0A0A0A] relative overflow-hidden text-left"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-bl-[100%] pointer-events-none" />
      <h3 className="text-2xl font-bold text-white mb-8 text-center md:text-left">
        Calculate Your Savings
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        <div className="space-y-6">
          {plans && plans.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Select Plan to Compare
              </label>
              <div className="flex bg-[#111] p-1 rounded-lg border border-white/5">
                {plans.map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => setSelectedPlanId(plan.id)}
                    className={`flex-1 py-2 text-xs md:text-sm font-medium rounded-md transition-all ${selectedPlanId === plan.id ? "bg-white/10 text-white shadow-sm" : "text-gray-500 hover:text-gray-300"}`}
                  >
                    {plan.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Generation Type
            </label>
            <div className="flex bg-[#111] p-1 rounded-lg border border-white/5">
              <button
                onClick={() => setType("prompt")}
                className={`flex-1 py-2 text-xs md:text-sm font-medium rounded-md transition-all ${type === "prompt" ? "bg-white/10 text-white shadow-sm" : "text-gray-500 hover:text-gray-300"}`}
              >
                Prompt Based
              </button>
              <button
                onClick={() => setType("reference")}
                className={`flex-1 py-2 text-xs md:text-sm font-medium rounded-md transition-all ${type === "reference" ? "bg-white/10 text-white shadow-sm" : "text-gray-500 hover:text-gray-300"}`}
              >
                Reference Based
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Quality
            </label>
            <div className="flex bg-[#111] p-1 rounded-lg border border-white/5">
              <button
                onClick={() => setQuality("standard")}
                className={`flex-1 py-2 text-xs md:text-sm font-medium rounded-md transition-all ${quality === "standard" ? "bg-white/10 text-white shadow-sm" : "text-gray-500 hover:text-gray-300"}`}
              >
                1K / 2K
              </button>
              <button
                onClick={() => setQuality("high")}
                className={`flex-1 py-2 text-xs md:text-sm font-medium rounded-md transition-all ${quality === "high" ? "bg-white/10 text-white shadow-sm" : "text-gray-500 hover:text-gray-300"}`}
              >
                4K Ultra
              </button>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-400">
                Number of Images
              </label>
              <span className="text-white font-bold">{quantity}</span>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-full accent-white"
            />
          </div>
        </div>

        <div className="flex flex-col justify-center p-6 md:p-8 bg-[#111] rounded-xl border border-white/5 mt-4 md:mt-0">
          <div className="flex justify-between items-end border-b border-white/10 pb-4 mb-4">
            <div>
              <div className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">
                Total Credits
              </div>
              <div className="text-3xl font-bold text-white">
                {totalCredits}
              </div>
            </div>
            <div className="text-right">
              <div className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">
                Est. Cost
              </div>
              <div className="text-3xl font-bold text-white">
                ${dollarTotalCost}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-400 text-sm">Cost per image</span>
            <span className="text-white font-medium">
              ${dollarCostPerImage}
            </span>
          </div>
          <div className="flex justify-between items-center mb-6">
            <span className="text-gray-400 text-sm">Approx Studio Cost</span>
            <span className="text-gray-500 line-through font-medium">
              ${studioCost.toFixed(2)}
            </span>
          </div>

          <div className="mt-auto bg-white/5 border border-white/10 rounded-lg p-4 text-center">
            <div className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">
              You Save
            </div>
            <div className="text-4xl font-bold text-emerald-400">
              ${savings}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const FreeCreditsBanner: React.FC = () => (
  <motion.div
    variants={fadeUpVariants}
    className="mt-16 max-w-[600px] mx-auto text-center px-4"
  >
    <h3 className="text-xl md:text-2xl font-bold text-white mb-4">
      Free Credits to Get Started
    </h3>
    <p className="text-gray-400 font-light leading-relaxed mb-6 text-sm md:text-base">
      Start learning and exploring Nexiro's powerful AI photography features
      without any payment. Sign up to receive free credits and experiment with
      our advanced tools to discover what's possible with your images.
    </p>
    <p className="text-xs md:text-sm text-gray-500 italic">
      No credit card required to get started. Upgrade anytime as you create more
      stunning visuals.
    </p>
  </motion.div>
);

interface PricingCardProps {
  plan?: Plan;
  isLoading: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({ plan, isLoading }) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="p-8 rounded-2xl border border-white/5 bg-[#0A0A0A] flex flex-col min-h-[400px] animate-pulse">
        <div className="w-32 h-6 bg-white/10 rounded mb-8" />
        <div className="w-24 h-12 bg-white/10 rounded mb-4" />
        <div className="w-16 h-6 bg-white/10 rounded-full mb-8" />
        <div className="space-y-3 mb-8">
          <div className="w-full h-4 bg-white/10 rounded" />
          <div className="w-[90%] h-4 bg-white/10 rounded" />
          <div className="w-[80%] h-4 bg-white/10 rounded" />
        </div>
        <div className="w-full h-12 bg-white/10 rounded-lg mt-auto" />
      </div>
    );
  }

  if (!plan) return null;

  const isLuxe = plan.name === "LUXE";

  return (
    <motion.div
      variants={fadeUpVariants}
      whileHover={{ scale: 1.02, y: -5 }}
      className={`p-8 rounded-2xl border ${isLuxe ? "border-white/30 bg-[#111]" : "border-white/10 bg-[#0A0A0A]"} relative flex flex-col min-h-[400px] overflow-hidden group transition-colors`}
    >
      {isLuxe && (
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-bl-[100%] pointer-events-none" />
      )}

      <div className="text-sm font-bold tracking-widest text-gray-400 mb-8">
        {plan.name}
      </div>

      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-4xl md:text-5xl font-bold text-white">
          ${plan.price}
        </span>
        <span className="text-gray-500 font-light">/mo</span>
      </div>

      <div className="inline-flex mb-8">
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold tracking-widest ${isLuxe ? "bg-white text-black" : "bg-white/10 text-white"}`}
        >
          {plan.credits} CREDITS
        </span>
      </div>

      <p className="text-gray-400 font-light text-sm leading-relaxed mb-10">
        {plan.description}
      </p>

      <button
        onClick={() => navigate("/auth")}
        className={`mt-auto w-full py-4 rounded-lg font-semibold transition-all ${isLuxe ? "bg-white text-black hover:bg-gray-200" : "bg-transparent border border-white/20 text-white hover:bg-white/5"} flex justify-center items-center`}
      >
        Select {plan.name}
      </button>
    </motion.div>
  );
};

const PricingSection: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await pricingAPI.getCurrentPlans();
        const sortedPlans = (data.plans || [])
          .filter((p: Plan) => p.isActive)
          .sort(
            (a: Plan, b: Plan) => parseFloat(a.price) - parseFloat(b.price),
          );
        setPlans(sortedPlans);
      } catch {
        // silently fail — pricing section will stay empty
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  return (
    <section
      className="py-20 md:py-[120px] px-4 md:px-6 bg-black border-t border-white/10"
      id="pricing"
    >
      <div className="max-w-[1000px] mx-auto">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="mb-10 md:mb-16 text-center">
            <motion.h2
              variants={fadeUpVariants}
              className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4"
            >
              Simple, Transparent Pricing
            </motion.h2>
            <motion.p
              variants={fadeUpVariants}
              className="text-lg md:text-xl text-gray-400 max-w-[720px] mx-auto font-light"
            >
              Credits never expire. Generate campaign assets only when you need
              them.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-[800px] mx-auto">
            {loading ? (
              <>
                <PricingCard isLoading />
                <PricingCard isLoading />
              </>
            ) : (
              plans.map((plan) => (
                <PricingCard key={plan.id} plan={plan} isLoading={false} />
              ))
            )}
          </div>

          <CreditCalculator plans={plans} />
          <FreeCreditsBanner />
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
