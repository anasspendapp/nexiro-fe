import React, { useState } from "react";
import { User, PlanType } from "../types";
import { authService } from "../services/authService";
import BackgroundBlobs from "../components/BackgroundBlobs";
import DashboardHeader from "../components/DashboardHeader";
import ServicesMenu from "../components/ServicesMenu";
import UpgradeModal from "../components/UpgradeModal";
import Footer from "../components/Footer";
import SettingsPage from "./SettingsPage";
import EnhanceTool from "./EnhanceTool";

interface DashboardProps {
  user: User;
  onUpdateUser: (u: User) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onUpdateUser }) => {
  const [currentView, setCurrentView] = useState<
    "menu" | "food" | "product" | "settings"
  >("menu");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [toolError, setToolError] = useState<string>("");

  const handleUpgrade = async (plan: PlanType) => {
    setIsUpgrading(true);
    try {
      const updatedUser = await authService.upgradePlan(user.email, plan);
      onUpdateUser(updatedUser);
      setShowUpgradeModal(false);
    } catch (e) {
      alert("Upgrade failed. Please try again.");
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-black text-gray-200 selection:bg-indigo-500 selection:text-white flex flex-col">
      <BackgroundBlobs />

      {showUpgradeModal && (
        <UpgradeModal
          onClose={() => setShowUpgradeModal(false)}
          onUpgrade={handleUpgrade}
          isProcessing={isUpgrading}
        />
      )}

      <DashboardHeader
        user={user}
        onSettings={() => setCurrentView("settings")}
        showBack={currentView !== "menu"}
        onBack={() => setCurrentView("menu")}
      />

      <main className="flex-grow w-full relative z-10 flex flex-col items-center">
        {currentView === "menu" && (
          <ServicesMenu
            onSelect={(service) => {
              if (service === "food" || service === "product")
                setCurrentView(service as any);
            }}
          />
        )}

        {currentView === "settings" && (
          <SettingsPage user={user} onUpdateUser={onUpdateUser} />
        )}

        {(currentView === "food" || currentView === "product") && (
          <div className="max-w-[1600px] mx-auto px-6 py-4 w-full flex-grow flex flex-col">
            <EnhanceTool
              user={user}
              onUpdateUser={onUpdateUser}
              onError={setToolError}
              errorMsg={toolError}
              onUpgradeRequired={() => setShowUpgradeModal(true)}
              toolType={currentView === "food" ? "FOOD" : "PRODUCT"}
            />
          </div>
        )}
      </main>

      <Footer />

      {/* Gradient Bottom Strip */}
      <div
        className={`w-full h-1 bg-gradient-to-r opacity-50 ${
          currentView === "product"
            ? "from-pink-500 via-purple-500 to-indigo-500"
            : "from-indigo-500 via-purple-500 to-pink-500"
        }`}
      ></div>
    </div>
  );
};

export default Dashboard;
