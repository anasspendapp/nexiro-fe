import React from "react";

interface ServicesMenuProps {
  onSelect: (service: "food" | "product") => void;
}

const ServicesMenu: React.FC<ServicesMenuProps> = ({ onSelect }) => (
  <div className="max-w-6xl mx-auto px-6 py-20 w-full animate-fade-in">
    <div className="text-center mb-16">
      <h2 className="text-4xl font-bold text-white mb-4">Select Your Studio</h2>
      <p className="text-gray-400 text-lg">
        Choose the specialized AI photography agent for your needs.
      </p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      <button
        onClick={() => onSelect("food")}
        className="group relative p-10 rounded-[2.5rem] bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-orange-500/50 hover:bg-orange-500/5 transition-all duration-500 text-left overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-orange-500/20 transition-all duration-500"></div>
        <div className="relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center mb-8 text-3xl group-hover:scale-110 transition-transform duration-500">
            🍔
          </div>
          <h3 className="text-3xl font-bold text-white mb-3 group-hover:text-orange-400 transition-colors">
            Food Photography
          </h3>
          <p className="text-gray-400 text-base leading-relaxed">
            Transform snapshots into mouth-watering, Michelin-star quality
            visuals. Optimized for textures, plating, and appetizing lighting.
          </p>
          <div className="mt-8 flex items-center text-orange-400 font-bold text-sm tracking-wide uppercase opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            Enter Studio <span className="ml-2">→</span>
          </div>
        </div>
      </button>

      <button
        onClick={() => onSelect("product")}
        className="group relative p-10 rounded-[2.5rem] bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all duration-500 text-left overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-500/20 transition-all duration-500"></div>
        <div className="relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-8 text-3xl group-hover:scale-110 transition-transform duration-500">
            🧴
          </div>
          <h3 className="text-3xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors">
            Product Photography
          </h3>
          <p className="text-gray-400 text-base leading-relaxed">
            Create high-end commercial product shots. Perfect for e-commerce,
            catalogs, and advertising campaigns with controlled lighting.
          </p>
          <div className="mt-8 flex items-center text-indigo-400 font-bold text-sm tracking-wide uppercase opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            Enter Studio <span className="ml-2">→</span>
          </div>
        </div>
      </button>
    </div>
  </div>
);

export default ServicesMenu;
