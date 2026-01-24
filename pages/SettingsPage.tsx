import React, { useState } from "react";
import { User, PlanType } from "../types";
import { authService } from "../services/authService";
import PlanCard from "../components/PlanCard";

interface SettingsPageProps {
  user: User;
  onUpdateUser: (u: User) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ user, onUpdateUser }) => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [driveLoading, setDriveLoading] = useState(false);
  const [msg, setMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const updatedUser = await authService.updateProfile(
        user.email,
        password || undefined,
      );
      onUpdateUser(updatedUser);
      setMsg({ type: "success", text: "Profile updated successfully" });
      setPassword("");
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || "Update failed" });
    } finally {
      setLoading(false);
    }
  };

  const handleDriveToggle = async () => {
    setDriveLoading(true);
    try {
      const updatedUser = await authService.toggleGoogleDrive(
        user.email,
        !user.isDriveConnected,
      );
      onUpdateUser(updatedUser);
    } catch (err) {
      alert("Failed to update integration settings.");
    } finally {
      setDriveLoading(false);
    }
  };

  const handlePlanChange = async (plan: PlanType) => {
    if (!confirm(`Are you sure you want to change your plan to ${plan}?`))
      return;
    setLoading(true);
    try {
      const updatedUser = await authService.upgradePlan(user.email, plan);
      onUpdateUser(updatedUser);
      setMsg({ type: "success", text: `Plan updated to ${plan}` });
    } catch (err) {
      setMsg({ type: "error", text: "Plan update failed" });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (
      !confirm(
        "Are you sure you want to cancel? You will lose access to remaining credits.",
      )
    )
      return;
    setLoading(true);
    try {
      const updatedUser = await authService.cancelSubscription(user.email);
      onUpdateUser(updatedUser);
      setMsg({ type: "success", text: "Subscription cancelled." });
    } catch (err) {
      setMsg({ type: "error", text: "Cancellation failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 animate-fade-in w-full">
      <h2 className="text-3xl font-bold text-white mb-8">Settings</h2>

      {msg && (
        <div
          className={`mb-6 p-4 rounded-xl border ${
            msg.type === "success"
              ? "bg-green-500/10 border-green-500/30 text-green-400"
              : "bg-red-500/10 border-red-500/30 text-red-400"
          }`}
        >
          {msg.text}
        </div>
      )}

      <div className="grid gap-8">
        {/* Profile Section */}
        <section className="glass-panel p-6 rounded-3xl border border-white/10">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-indigo-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Profile & Security
          </h3>
          <form onSubmit={handleProfileUpdate} className="space-y-4 max-w-md">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-gray-400 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                New Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Leave blank to keep current"
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-white hover:bg-gray-200 text-black font-bold rounded-xl text-sm transition-colors disabled:opacity-50"
            >
              {loading ? "Saving..." : "Update Profile"}
            </button>
          </form>
        </section>

        {/* Integrations Section */}
        <section className="glass-panel p-6 rounded-3xl border border-white/10">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-indigo-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
              />
            </svg>
            Integrations
          </h3>
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                <svg viewBox="0 0 87.3 78" className="w-7 h-7">
                  <path
                    d="M6.6 66.85l3.85 6.65c.8 1.4 1.9 2.5 3.2 3.3l12.3-21.3h-22c.2 4.4 1.3 8.3 2.65 11.35z"
                    fill="#0066da"
                  />
                  <path
                    d="M43.65 25l12.3-21.3c-1.3-.8-2.4-1.9-3.2-3.3l-3.85-6.65c-2.75-4.4-7.15-4.4-11.35 0l-11 19.1h22v12.2z"
                    fill="#00ac47"
                  />
                  <path
                    d="M73.55 76.8c4.4 0 8.3-1.1 11.35-2.65l-3.85-6.65c-.8-1.4-1.9-2.5-3.2-3.3l-12.3 21.3h12.2z"
                    fill="#ea4335"
                  />
                  <path
                    d="M43.65 25L31.35 46.3l11 19.1h22L52.05 46.3l11.6-20.1h-20z"
                    fill="#ffba00"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-white">Google Drive</h4>
                <p className="text-sm text-gray-400">
                  Auto-save enhanced images to your drive.
                </p>
              </div>
            </div>
            <button
              onClick={handleDriveToggle}
              disabled={driveLoading}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-black ${
                user.isDriveConnected ? "bg-indigo-600" : "bg-gray-700"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  user.isDriveConnected ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </section>

        {/* Subscription Section */}
        <section className="glass-panel p-6 rounded-3xl border border-white/10">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <svg
                className="w-5 h-5 text-indigo-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
              Subscription Management
            </h3>
            {user.plan !== PlanType.FREE && (
              <button
                onClick={handleCancel}
                disabled={loading}
                className="text-xs text-red-400 hover:text-red-300 font-semibold underline"
              >
                Cancel Subscription
              </button>
            )}
          </div>

          <div className="mb-8 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider block mb-1">
                Current Balance
              </span>
              <span className="text-3xl font-bold text-white">
                {user.credits}{" "}
                <span className="text-sm font-medium text-gray-400">
                  credits
                </span>
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                Current Plan
              </span>
              <span className="text-lg font-bold text-white">{user.plan}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PlanCard
              name="Starter"
              price="30"
              credits={40}
              features={[
                "Standard Gen: 1 Credit",
                "Reference Style: 4 Credits",
                "Standard Support",
              ]}
              currentMode={user.plan === PlanType.STARTER}
              actionLabel={
                user.plan === PlanType.STARTER
                  ? undefined
                  : user.plan === PlanType.PRO
                  ? "Downgrade"
                  : "Upgrade"
              }
              onAction={() => handlePlanChange(PlanType.STARTER)}
              disabled={loading}
            />
            <PlanCard
              name="Pro"
              price="80"
              credits={150}
              features={[
                "Standard Gen: 1 Credit",
                "Reference Style: 4 Credits",
                "Priority Processing",
                "Commercial License",
              ]}
              currentMode={user.plan === PlanType.PRO}
              bestValue={true}
              actionLabel={user.plan === PlanType.PRO ? undefined : "Upgrade"}
              onAction={() => handlePlanChange(PlanType.PRO)}
              disabled={loading}
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;
