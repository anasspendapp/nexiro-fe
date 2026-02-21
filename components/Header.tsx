import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { useAlert } from "./AlertProvider";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = authService.getSession();
  const { confirm } = useAlert();
  const isDashboardRoute = location.pathname.startsWith("/dashboard");
  const isDashboardRoot = location.pathname === "/dashboard";
  const showNavLinks = !isDashboardRoute;
  const showAuthButtons = !user && !isDashboardRoute;
  const showBack = isDashboardRoute && !isDashboardRoot;
  const showSettings = isDashboardRoute && !!user;
  const isSticky = isDashboardRoute;

  const handleLogout = async () => {
    const approved = await confirm({
      title: "Confirm logout",
      message: "Are you sure you want to log out?",
      confirmLabel: "Log out",
      cancelLabel: "Cancel",
      variant: "warning",
    });

    if (!approved) return;

    authService.clearSession();
    window.location.href = "/";
  };

  const handleHomeClick = () => {
    if (user) {
      navigate("/dashboard");
      return;
    }
    navigate("/");
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  const handleSettings = () => {
    navigate("/dashboard/settings");
  };

  return (
    <nav
      className={`relative z-20 border-b border-white/5 backdrop-blur-xl bg-black/40 ${
        isSticky ? "sticky top-0" : ""
      }`}
    >
      <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showBack ? (
            <button
              onClick={handleBack}
              className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors"
              title="Back"
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
          ) : null}
          <div
            className="text-2xl font-bold cursor-pointer"
            onClick={handleHomeClick}
          >
            Nex<span className="text-indigo-400">iro</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {showNavLinks && (
            <>
              <button
                onClick={() => navigate("/features")}
                className="text-sm font-medium text-white/80 hover:text-white transition-colors"
              >
                Features
              </button>
              <button
                onClick={() => navigate("/pricing")}
                className="text-sm font-medium text-white/80 hover:text-white transition-colors"
              >
                Pricing
              </button>
            </>
          )}

          {user ? (
            <>
              <div className="text-xs text-gray-400 hidden sm:block">
                {user.email}
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                <span
                  className={`text-xs font-bold ${
                    user.credits < 5 ? "text-red-400" : "text-indigo-300"
                  }`}
                >
                  {user.credits} Credits Left
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600/10 text-red-400 hover:text-red-300 hover:bg-red-600/20 rounded-lg text-sm font-medium transition-colors"
              >
                Logout
              </button>
              {showSettings ? (
                <button
                  onClick={handleSettings}
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
              ) : null}
            </>
          ) : showAuthButtons ? (
            <div className="flex gap-4">
              <button
                onClick={() => navigate("/auth")}
                className="text-sm font-semibold hover:text-indigo-400 transition-colors"
              >
                Log In
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm font-medium transition-all"
              >
                Get Started
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </nav>
  );
};

export default Header;
