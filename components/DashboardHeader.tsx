import React from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { User } from "../types";

interface DashboardHeaderProps {
  user: User;
  onSettings: () => void;
  onBack?: () => void;
  showBack?: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  user,
  onSettings,
  onBack,
  showBack,
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.clearSession();
    window.location.href = "/";
  };

  window.console.log("Rendering DashboardHeader for user:", user);

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-black/80 backdrop-blur-xl">
      <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showBack && onBack ? (
            <button
              onClick={onBack}
              className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors mr-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                />
              </svg>
            </button>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/20">
              N
            </div>
          )}
          <h1 className="text-xl font-bold tracking-tight text-white">
            Nex<span className="text-indigo-400">iro</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-xs text-gray-400 hidden sm:block">
            {user.email}
          </div>

          {/* Credit Display */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
            <span
              className={`text-xs font-bold ${
                user.credits < 5 ? "text-red-400" : "text-indigo-300"
              }`}
            >
              {user.credits} Credits Left
            </span>
          </div>

          {/* Settings Button */}
          <button
            onClick={onSettings}
            className="p-2 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            title="Settings"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="p-2 bg-red-600/10 text-red-400 hover:text-red-300 hover:bg-red-600/20 rounded-full transition-colors"
            title="Logout"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
