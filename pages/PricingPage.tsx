import React from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { subscriptionAPI } from "../services/api";
import PlanCard from "../components/PlanCard";
import BackgroundBlobs from "../components/BackgroundBlobs";
import Header from "../components/Header";
import Footer from "../components/Footer";

const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const user = authService.getSession();

  const handleStripeCheckout = async (priceId: string) => {
    if (!user) {
      navigate("/auth");
      return;
    }
    console.log("Initiating Checkout for Price:", priceId);
    if (!priceId) {
      alert("Error: Price ID is missing. Please refresh and try again.");
      return;
    }
    try {
      const data = await subscriptionAPI.createCheckoutSession({
        priceId,
        email: user.email,
        successUrl: `${window.location.origin}/?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/`,
      });
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.message || "Failed to start checkout");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Checkout failed");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden flex flex-col">
      <BackgroundBlobs />

      <Header showAuth={true} showNavLinks={true} />

      <div className="relative z-10 max-w-5xl w-full mx-auto p-6 flex-grow flex flex-col items-center justify-center animate-fade-in">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Select Your Plan</h2>
          <p className="text-gray-400">
            Choose the plan that fits your creative needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <PlanCard
            name="Starter"
            price="0.50"
            credits={40}
            features={[
              "Ideal for small menus",
              "Standard Gen: 1 Credit",
              "Reference Style: 4 Credits",
              "4K Downloads",
            ]}
            onSelect={() =>
              handleStripeCheckout("price_1SoPnLLUvj13gMgzxPDK2w7m")
            }
            selected={false}
            actionLabel="Get Starter"
            onAction={() =>
              handleStripeCheckout("price_1SoPnLLUvj13gMgzxPDK2w7m")
            }
          />
          <PlanCard
            name="Pro"
            price="1.00"
            credits={150}
            features={[
              "Ideal for agencies & catalogs",
              "Standard Gen: 1 Credit",
              "Reference Style: 4 Credits",
              "Priority Processing",
              "Commercial License",
            ]}
            onSelect={() =>
              handleStripeCheckout("price_1SoPnMLUvj13gMgzsvTrTkrl")
            }
            selected={false}
            bestValue={true}
            actionLabel="Get Pro"
            onAction={() =>
              handleStripeCheckout("price_1SoPnMLUvj13gMgzsvTrTkrl")
            }
          />
        </div>

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
