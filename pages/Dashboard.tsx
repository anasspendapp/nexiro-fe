import React, { useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { User, PlanType } from "../types";
import { authService } from "../services/authService";
import BackgroundBlobs from "../components/BackgroundBlobs";
import Header from "../components/Header";
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
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [toolError, setToolError] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();
  const isMenuRoute = location.pathname === "/dashboard";
  const isProductRoute = location.pathname === "/dashboard/product";

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-black text-gray-200 selection:bg-indigo-500 selection:text-white flex flex-col">
      <BackgroundBlobs />

      {showUpgradeModal && (
        <UpgradeModal
          onClose={() => setShowUpgradeModal(false)}
          isProcessing={false}
        />
      )}

      <Header />

      <main className="flex-grow w-full relative z-10 flex flex-col items-center">
        <Routes>
          <Route
            index
            element={
              <ServicesMenu
                onSelect={(service) => navigate(`/dashboard/${service}`)}
              />
            }
          />
          <Route
            path="settings"
            element={<SettingsPage user={user} onUpdateUser={onUpdateUser} />}
          />
          <Route
            path="food"
            element={
              <div className="max-w-[1600px] mx-auto px-6 py-4 w-full flex-grow flex flex-col">
                <EnhanceTool
                  user={user}
                  onUpdateUser={onUpdateUser}
                  onError={setToolError}
                  errorMsg={toolError}
                  onUpgradeRequired={() => setShowUpgradeModal(true)}
                  toolType="FOOD"
                />
              </div>
            }
          />
          <Route
            path="product"
            element={
              <div className="max-w-[1600px] mx-auto px-6 py-4 w-full flex-grow flex flex-col">
                <EnhanceTool
                  user={user}
                  onUpdateUser={onUpdateUser}
                  onError={setToolError}
                  errorMsg={toolError}
                  onUpgradeRequired={() => setShowUpgradeModal(true)}
                  toolType="PRODUCT"
                />
              </div>
            }
          />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>

      <Footer />

      {/* Gradient Bottom Strip */}
      <div
        className={`w-full h-1 bg-gradient-to-r opacity-50 ${
          isProductRoute
            ? "from-pink-500 via-purple-500 to-indigo-500"
            : "from-indigo-500 via-purple-500 to-pink-500"
        }`}
      ></div>
    </div>
  );
};

export default Dashboard;
