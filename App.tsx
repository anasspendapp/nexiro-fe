import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { User } from "./types";
import { authService } from "./services/authService";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import PricingPage from "./pages/PricingPage";
import FeaturesPage from "./pages/FeaturesPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";
import Dashboard from "./pages/Dashboard";

// Protected Route Component
const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  user: User | null;
}> = ({ children, user }) => {
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  // Initialize state from potential existing session
  const [user, setUser] = useState<User | null>(authService.getSession());
  const [isLoading, setIsLoading] = useState(true);

  // Fetch fresh user data from backend on mount
  useEffect(() => {
    const fetchUserData = async () => {
      const sessionUser = authService.getSession();
      if (sessionUser?.email) {
        try {
          // Fetch fresh user data from backend
          const freshUser = await authService.getCurrentUser(sessionUser.email);
          // Update state and localStorage with fresh data
          setUser(freshUser);
          authService.saveSession(freshUser);
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          // If fetch fails, clear invalid session
          authService.clearSession();
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    fetchUserData();
  }, []);

  // Check for success param from Stripe redirect
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get("session_id")) {
      window.history.replaceState({}, "", "/");

      if (user?.email) {
        alert("Payment successful! Verifying your plan...");

        setTimeout(async () => {
          try {
            const updatedUser = await authService.getCurrentUser(user.email);
            setUser(updatedUser);
            alert("Plan upgraded successfully!");
          } catch (e) {
            console.error("Verification failed", e);
            alert(
              "Payment received, but auto-refresh failed. Please refresh the page.",
            );
          }
        }, 2000);
      } else {
        alert("Payment successful! Please sign in to see your new plan.");
      }
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            user ? <Navigate to="/dashboard" replace /> : <LandingPage />
          }
        />
        <Route
          path="/auth"
          element={user ? <Navigate to="/dashboard" replace /> : <AuthPage />}
        />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsOfServicePage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute user={user}>
              <Dashboard user={user!} onUpdateUser={setUser} />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
