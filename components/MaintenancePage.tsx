import React from "react";
import maintenanceSvg from "../images/maintanace.svg";

const MaintenancePage: React.FC = () => {
  return (
    <div className="min-h-screen relative overflow-hidden bg-black text-white flex flex-col items-center justify-center">
      {/* Background Blobs */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/20 blur-[120px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-purple-900/20 blur-[120px] pointer-events-none z-0"></div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Nex<span className="text-indigo-400">iro</span>
          </h1>
        </div>

        {/* Maintenance SVG */}
        <div className="mb-12 flex justify-center">
          <div className="w-full max-w-md">
            <img
              src={maintenanceSvg}
              alt="Under Maintenance"
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* Maintenance Message */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-orange-400 animate-pulse"></span>
            <span className="text-sm font-medium text-gray-300">
              Under Maintenance
            </span>
          </div>

          <h2 className="text-5xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
            We'll Be Back Soon
          </h2>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            We're currently performing scheduled maintenance to improve your
            experience. Our AI photography studio will be back online shortly.
          </p>

          {/* Status Info */}
          <div className="mt-8 p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm max-w-lg mx-auto">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-indigo-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-white font-semibold">Estimated Downtime</p>
            </div>
            <p className="text-gray-400 text-sm">
              We expect to be back within the next few hours. Thank you for your
              patience!
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
    </div>
  );
};

export default MaintenancePage;
