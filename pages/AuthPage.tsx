import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { authService } from "../services/authService";
import BackgroundBlobs from "../components/BackgroundBlobs";

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuthSuccess = async (user: any) => {
    if (!user.isPro) {
      navigate("/pricing");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden flex items-center justify-center p-6">
      <BackgroundBlobs />

      <button
        onClick={() => navigate("/")}
        className="absolute top-8 left-8 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors z-20"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
      </button>

      <div className="w-full max-w-md bg-[#111] border border-white/10 p-8 rounded-3xl relative z-10 shadow-2xl shadow-indigo-500/10">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-xl font-bold mb-4 mx-auto shadow-lg shadow-indigo-500/20">
            N
          </div>
          <h2 className="text-2xl font-bold mb-2">Welcome to Nexiro</h2>
          <p className="text-gray-400 text-sm">
            {"Sign in to access your professional AI studio."}
          </p>
        </div>

        <div className="mt-6 flex justify-center">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              if (credentialResponse.credential) {
                setLoading(true);
                try {
                  const user = await authService.googleLogin(
                    credentialResponse.credential,
                  );
                  await handleAuthSuccess(user);
                } catch (err: any) {
                  console.error(err);
                  setError(err.message || "Google Login Failed");
                } finally {
                  setLoading(false);
                }
              }
            }}
            onError={() => {
              setError("Google Login Failed");
            }}
            theme="filled_black"
            shape="pill"
            size="large"
            width="300"
          />
        </div>

        {error && (
          <div className="text-red-400 text-sm text-center bg-red-500/10 p-2 rounded-lg mt-4">
            {error}
          </div>
        )}
        {loading && (
          <div className="text-indigo-400 text-sm text-center mt-4">
            Authenticating...
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-gray-500 text-xs text-center mt-4">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
