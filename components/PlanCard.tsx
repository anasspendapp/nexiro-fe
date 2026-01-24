import React from "react";

interface PlanCardProps {
  name: string;
  price: string;
  credits: number;
  features: string[];
  selected?: boolean;
  onSelect?: () => void;
  bestValue?: boolean;
  currentMode?: boolean;
  actionLabel?: string;
  onAction?: () => void;
  disabled?: boolean;
}

const PlanCard: React.FC<PlanCardProps> = ({
  name,
  price,
  credits,
  features,
  selected,
  onSelect,
  bestValue,
  currentMode,
  actionLabel,
  onAction,
  disabled,
}) => (
  <div
    onClick={onSelect}
    className={`relative p-6 rounded-2xl border transition-all duration-300 flex flex-col h-full ${
      selected
        ? "bg-indigo-900/20 border-indigo-500 shadow-lg shadow-indigo-500/20 scale-[1.02] cursor-pointer"
        : currentMode
        ? "bg-white/5 border-white/20"
        : "bg-white/5 border-white/10 hover:border-white/20"
    }`}
  >
    {bestValue && (
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
        Best Value
      </div>
    )}
    {currentMode && (
      <div className="absolute top-4 right-4">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-500/20 text-green-400 border border-green-500/30">
          CURRENT PLAN
        </span>
      </div>
    )}

    <div className="flex justify-between items-start mb-4">
      <div>
        <h3
          className={`text-lg font-bold ${
            selected || currentMode ? "text-white" : "text-gray-300"
          }`}
        >
          {name}
        </h3>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-2xl font-bold text-white">${price}</span>
          <span className="text-xs text-gray-500">/mo</span>
        </div>
      </div>
      {selected && !currentMode && (
        <div className="w-6 h-6 rounded-full border-2 border-indigo-400 bg-indigo-500 flex items-center justify-center">
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      )}
    </div>

    <div className="mb-6 p-3 bg-black/30 rounded-lg border border-white/5 text-center">
      <span className="text-xl font-bold text-indigo-300">{credits}</span>
      <span className="text-xs text-gray-400 block uppercase tracking-wide mt-1">
        Monthly Credits
      </span>
    </div>

    <ul className="space-y-3 flex-grow mb-6">
      {features.map((feat, idx) => (
        <li key={idx} className="flex items-start gap-3 text-sm text-gray-400">
          <svg
            className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span>{feat}</span>
        </li>
      ))}
    </ul>

    {actionLabel && onAction && (
      <button
        onClick={(e) => {
          e.stopPropagation();
          onAction();
        }}
        disabled={disabled}
        className="w-full py-3 bg-white hover:bg-gray-100 text-black font-bold rounded-xl text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {actionLabel}
      </button>
    )}
  </div>
);

export default PlanCard;
