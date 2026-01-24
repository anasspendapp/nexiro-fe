import React from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

interface HeaderProps {
  showAuth?: boolean;
  showNavLinks?: boolean;
  showLogout?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  showAuth = true,
  showNavLinks = false,
  showLogout = false,
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.clearSession();
    window.location.href = "/";
  };

  return (
    <nav className="relative z-20 border-b border-white/5 backdrop-blur-xl bg-black/40">
      <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
        <div
          className="text-2xl font-bold cursor-pointer"
          onClick={() => navigate("/")}
        >
          Nex<span className="text-indigo-400">iro</span>
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

          {showAuth && (
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
          )}

          {showLogout && (
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-all"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
