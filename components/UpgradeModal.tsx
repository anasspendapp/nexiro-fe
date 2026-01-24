import React from "react";
import { PlanType } from "../types";
import PlanCard from "./PlanCard";

interface UpgradeModalProps {
  onClose: () => void;
  onUpgrade: (plan: PlanType) => void;
  isProcessing: boolean;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({
  onClose,
  onUpgrade,
  isProcessing,
}) => (
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
        <h3 className="text-3xl font-bold text-white mb-3">Choose Your Plan</h3>
        <p className="text-gray-400 max-w-lg mx-auto">
          Get more credits to transform your product photography. Plans renew
          monthly. No credit rollover.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PlanCard
          name="Starter"
          price="30"
          credits={40}
          features={[
            "Ideal for small menus",
            "Standard Gen: 1 Credit",
            "Reference Style: 4 Credits",
            "4K Downloads",
          ]}
          onSelect={() => onUpgrade(PlanType.STARTER)}
          selected={false}
        />
        <PlanCard
          name="Pro"
          price="80"
          credits={150}
          features={[
            "Ideal for agencies & catalogs",
            "Standard Gen: 1 Credit",
            "Reference Style: 4 Credits",
            "Priority Processing",
            "Commercial License",
          ]}
          onSelect={() => onUpgrade(PlanType.PRO)}
          selected={false}
          bestValue={true}
        />
      </div>

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
          <p className="text-white font-semibold">Updating your plan...</p>
        </div>
      )}
    </div>
  </div>
);

export default UpgradeModal;
