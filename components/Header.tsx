import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { useAlert } from "./AlertProvider";
import logoImg from "@/images/logo.png";

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
    <header
      className={`${user ? "relative" : "fixed top-2 md:top-4 left-0 right-0"} z-50 px-2 md:px-6 flex justify-center pointer-events-none`}
    >
      <nav
        className={`max-w-[1200px] w-full flex justify-between items-center bg-black/60 backdrop-blur-xl border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.5)] rounded-2xl px-4 md:px-6 py-3 md:py-4 pointer-events-auto transition-all ${user ? "my-4" : ""}`}
      >
        {/* Logo Section */}
        <div className="flex items-center gap-3 shrink-0">
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
          <button
            onClick={handleHomeClick}
            className="cursor-pointer flex items-center justify-start shrink-0 w-16 sm:w-20 md:w-28 h-8 md:h-10 relative overflow-visible"
          >
            <img
              src={logoImg}
              alt="Nexiro"
              className="absolute top-1/2 left-0 -translate-x-4 md:-translate-x-8 -translate-y-1/2 w-[160px] sm:w-[200px] md:w-[180px] max-w-none hover:opacity-80 transition-opacity"
            />
          </button>
        </div>

        {/* Navigation Links */}
        {showNavLinks && (
          <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-400">
            <a
              href="/#features"
              className="hover:text-white transition-colors scroll-smooth"
            >
              Features
            </a>
            <a
              href="/#pricing"
              className="hover:text-white transition-colors scroll-smooth"
            >
              Pricing
            </a>
          </nav>
        )}

        {/* Right Section - CTA / Auth / User */}
        <div className="flex items-center gap-3 md:gap-4 shrink-0">
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
            <>
              <button
                onClick={() => navigate("/auth")}
                className="hidden sm:block text-xs md:text-sm font-semibold text-gray-300 hover:text-white transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/auth")}
                className="px-4 border border-white/20 md:border-0 md:px-5 py-1.5 md:py-2 rounded-lg bg-white hover:bg-gray-200 text-black font-semibold text-xs md:text-sm transition-transform hover:-translate-y-0.5 shadow-md shadow-white/5"
              >
                Sign up
              </button>
            </>
          ) : null}
        </div>
      </nav>
    </header>
  );
};

export default Header;
