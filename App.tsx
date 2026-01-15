import React, { useState, useEffect, useRef } from 'react';
import { AppState, ImageAsset, AspectRatio, ImageQuality, BackgroundMode, CameraAngle, UsageScenario, User, ToolType, PlanType } from './types';
import { enhanceImage, analyzeImage, analyzeReferenceProps, StyleInput, EnhancementOptions } from './services/geminiService';
import { authService } from './services/authService';
import { GoogleLogin } from '@react-oauth/google';
import ImageUploader from './components/ImageUploader';

// --- Components ---

const BackgroundBlobs = () => (
    <>
        <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/20 blur-[120px] pointer-events-none z-0"></div>
        <div className="fixed bottom-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-purple-900/20 blur-[120px] pointer-events-none z-0"></div>
    </>
);

const Footer = () => (
    <footer className="border-t border-white/5 bg-black/40 backdrop-blur-xl mt-auto relative z-10 w-full">
        <div className="max-w-[1600px] mx-auto px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white">Nex<span className="text-indigo-400">iro</span></h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        Professional AI photography enhancement tool. Transform your creative visions into reality.
                    </p>
                </div>
                <div>
                    <h4 className="text-white font-semibold mb-4">Product</h4>
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li><a href="#" className="hover:text-indigo-400 transition-colors">Features</a></li>
                        <li><a href="#" className="hover:text-indigo-400 transition-colors">Pricing</a></li>
                        <li><a href="#" className="hover:text-indigo-400 transition-colors">Showcase</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-white font-semibold mb-4">Resources</h4>
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li><a href="#" className="hover:text-indigo-400 transition-colors">Documentation</a></li>
                        <li><a href="#" className="hover:text-indigo-400 transition-colors">API Reference</a></li>
                        <li><a href="#" className="hover:text-indigo-400 transition-colors">Community</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-white font-semibold mb-4">Legal</h4>
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li><a href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</a></li>
                        <li><a href="#" className="hover:text-indigo-400 transition-colors">Terms of Service</a></li>
                    </ul>
                </div>
            </div>
            <div className="pt-8 border-t border-white/5 text-center text-gray-500 text-xs">
                © 2024 Nexiro AI. All rights reserved.
            </div>
        </div>
    </footer>
);

// --- Pricing Plan Component ---

const PlanCard: React.FC<{
    name: string;
    price: string;
    credits: number;
    features: string[];
    selected?: boolean;
    onSelect?: () => void;
    bestValue?: boolean;
    currentMode?: boolean; // If this is the active plan in settings
    actionLabel?: string;
    onAction?: () => void;
    disabled?: boolean;
}> = ({ name, price, credits, features, selected, onSelect, bestValue, currentMode, actionLabel, onAction, disabled }) => (
    <div
        onClick={onSelect}
        className={`relative p-6 rounded-2xl border transition-all duration-300 flex flex-col h-full ${selected
            ? 'bg-indigo-900/20 border-indigo-500 shadow-lg shadow-indigo-500/20 scale-[1.02] cursor-pointer'
            : currentMode
                ? 'bg-white/5 border-white/20'
                : 'bg-white/5 border-white/10 hover:border-white/20'
            }`}
    >
        {bestValue && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                Best Value
            </div>
        )}
        {currentMode && (
            <div className="absolute top-4 right-4">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-500/20 text-green-400 border border-green-500/30">
                    CURRENT PLAN
                </span>
            </div>
        )}

        <div className="flex justify-between items-start mb-4">
            <div>
                <h3 className={`text-lg font-bold ${selected || currentMode ? 'text-white' : 'text-gray-300'}`}>{name}</h3>
                <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-bold text-white">${price}</span>
                    <span className="text-xs text-gray-500">/mo</span>
                </div>
            </div>
            {selected && !currentMode && (
                <div className="w-6 h-6 rounded-full border-2 border-indigo-400 bg-indigo-500 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
            )}
        </div>

        <div className="mb-6 p-3 bg-black/30 rounded-lg border border-white/5 text-center">
            <span className="text-xl font-bold text-indigo-300">{credits}</span>
            <span className="text-xs text-gray-400 block uppercase tracking-wide mt-1">Monthly Credits</span>
        </div>

        <ul className="space-y-3 flex-grow mb-6">
            {features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-gray-400">
                    <svg className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    <span>{feat}</span>
                </li>
            ))}
        </ul>

        {actionLabel && onAction && (
            <button
                onClick={(e) => { e.stopPropagation(); onAction(); }}
                disabled={disabled}
                className="w-full py-3 bg-white hover:bg-gray-100 text-black font-bold rounded-xl text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {actionLabel}
            </button>
        )}
    </div>
);

// --- Upgrade Modal ---
const UpgradeModal: React.FC<{ onClose: () => void; onUpgrade: (plan: PlanType) => void; isProcessing: boolean }> = ({ onClose, onUpgrade, isProcessing }) => (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md animate-fade-in p-4 overflow-y-auto">
        <div className="bg-[#111] border border-white/10 rounded-3xl p-8 max-w-4xl w-full relative shadow-2xl shadow-indigo-500/10 my-8">
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white z-20">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            <div className="text-center mb-10">
                <h3 className="text-3xl font-bold text-white mb-3">Choose Your Plan</h3>
                <p className="text-gray-400 max-w-lg mx-auto">Get more credits to transform your product photography. Plans renew monthly. No credit rollover.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PlanCard
                    name="Starter"
                    price="30"
                    credits={40}
                    features={["Ideal for small menus", "Standard Gen: 1 Credit", "Reference Style: 4 Credits", "4K Downloads"]}
                    onSelect={() => onUpgrade(PlanType.STARTER)}
                    selected={false}
                />
                <PlanCard
                    name="Pro"
                    price="80"
                    credits={150}
                    features={["Ideal for agencies & catalogs", "Standard Gen: 1 Credit", "Reference Style: 4 Credits", "Priority Processing", "Commercial License"]}
                    onSelect={() => onUpgrade(PlanType.PRO)}
                    selected={false}
                    bestValue={true}
                />
            </div>

            {isProcessing && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-30 rounded-3xl">
                    <svg className="animate-spin h-10 w-10 text-indigo-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <p className="text-white font-semibold">Updating your plan...</p>
                </div>
            )}
        </div>
    </div>
);

// --- Settings Page ---
const SettingsPage: React.FC<{ user: User; onUpdateUser: (u: User) => void }> = ({ user, onUpdateUser }) => {
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [driveLoading, setDriveLoading] = useState(false);
    const [msg, setMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMsg(null);
        try {
            const updatedUser = await authService.updateProfile(user.email, password || undefined);
            onUpdateUser(updatedUser);
            setMsg({ type: 'success', text: 'Profile updated successfully' });
            setPassword("");
        } catch (err: any) {
            setMsg({ type: 'error', text: err.message || 'Update failed' });
        } finally {
            setLoading(false);
        }
    };

    const handleDriveToggle = async () => {
        setDriveLoading(true);
        try {
            const updatedUser = await authService.toggleGoogleDrive(user.email, !user.isDriveConnected);
            onUpdateUser(updatedUser);
        } catch (err) {
            alert("Failed to update integration settings.");
        } finally {
            setDriveLoading(false);
        }
    };

    const handlePlanChange = async (plan: PlanType) => {
        if (!confirm(`Are you sure you want to change your plan to ${plan}?`)) return;
        setLoading(true);
        try {
            const updatedUser = await authService.upgradePlan(user.email, plan);
            onUpdateUser(updatedUser);
            setMsg({ type: 'success', text: `Plan updated to ${plan}` });
        } catch (err) {
            setMsg({ type: 'error', text: 'Plan update failed' });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async () => {
        if (!confirm("Are you sure you want to cancel? You will lose access to remaining credits.")) return;
        setLoading(true);
        try {
            const updatedUser = await authService.cancelSubscription(user.email);
            onUpdateUser(updatedUser);
            setMsg({ type: 'success', text: 'Subscription cancelled.' });
        } catch (err) {
            setMsg({ type: 'error', text: 'Cancellation failed' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-6 py-12 animate-fade-in w-full">
            <h2 className="text-3xl font-bold text-white mb-8">Settings</h2>

            {msg && (
                <div className={`mb-6 p-4 rounded-xl border ${msg.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                    {msg.text}
                </div>
            )}

            <div className="grid gap-8">
                {/* 1. Profile Section */}
                <section className="glass-panel p-6 rounded-3xl border border-white/10">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        Profile & Security
                    </h3>
                    <form onSubmit={handleProfileUpdate} className="space-y-4 max-w-md">
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Email</label>
                            <input type="email" value={user.email} disabled className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-gray-400 cursor-not-allowed" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">New Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Leave blank to keep current"
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                        <button type="submit" disabled={loading} className="px-6 py-3 bg-white hover:bg-gray-200 text-black font-bold rounded-xl text-sm transition-colors disabled:opacity-50">
                            {loading ? 'Saving...' : 'Update Profile'}
                        </button>
                    </form>
                </section>

                {/* 2. Integrations Section */}
                <section className="glass-panel p-6 rounded-3xl border border-white/10">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></svg>
                        Integrations
                    </h3>
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                                {/* Google Drive Icon */}
                                <svg viewBox="0 0 87.3 78" className="w-7 h-7">
                                    <path d="M6.6 66.85l3.85 6.65c.8 1.4 1.9 2.5 3.2 3.3l12.3-21.3h-22c.2 4.4 1.3 8.3 2.65 11.35z" fill="#0066da" />
                                    <path d="M43.65 25l12.3-21.3c-1.3-.8-2.4-1.9-3.2-3.3l-3.85-6.65c-2.75-4.4-7.15-4.4-11.35 0l-11 19.1h22v12.2z" fill="#00ac47" />
                                    <path d="M73.55 76.8c4.4 0 8.3-1.1 11.35-2.65l-3.85-6.65c-.8-1.4-1.9-2.5-3.2-3.3l-12.3 21.3h12.2z" fill="#ea4335" />
                                    <path d="M43.65 25L31.35 46.3l11 19.1h22L52.05 46.3l11.6-20.1h-20z" fill="#ffba00" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-bold text-white">Google Drive</h4>
                                <p className="text-sm text-gray-400">Auto-save enhanced images to your drive.</p>
                            </div>
                        </div>
                        <button
                            onClick={handleDriveToggle}
                            disabled={driveLoading}
                            className={`
                                relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-black
                                ${user.isDriveConnected ? 'bg-indigo-600' : 'bg-gray-700'}
                            `}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${user.isDriveConnected ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </div>
                </section>

                {/* 3. Subscription Section */}
                <section className="glass-panel p-6 rounded-3xl border border-white/10">
                    <div className="flex justify-between items-start mb-6">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                            Subscription Management
                        </h3>
                        {user.plan !== PlanType.FREE && (
                            <button onClick={handleCancel} disabled={loading} className="text-xs text-red-400 hover:text-red-300 font-semibold underline">
                                Cancel Subscription
                            </button>
                        )}
                    </div>

                    <div className="mb-8 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-between">
                        <div>
                            <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider block mb-1">Current Balance</span>
                            <span className="text-3xl font-bold text-white">{user.credits} <span className="text-sm font-medium text-gray-400">credits</span></span>
                        </div>
                        <div className="text-right">
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Current Plan</span>
                            <span className="text-lg font-bold text-white">{user.plan}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <PlanCard
                            name="Starter"
                            price="30"
                            credits={40}
                            features={["Standard Gen: 1 Credit", "Reference Style: 4 Credits", "Standard Support"]}
                            currentMode={user.plan === PlanType.STARTER}
                            actionLabel={user.plan === PlanType.STARTER ? undefined : (user.plan === PlanType.PRO ? "Downgrade" : "Upgrade")}
                            onAction={() => handlePlanChange(PlanType.STARTER)}
                            disabled={loading}
                        />
                        <PlanCard
                            name="Pro"
                            price="80"
                            credits={150}
                            features={["Standard Gen: 1 Credit", "Reference Style: 4 Credits", "Priority Processing", "Commercial License"]}
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

// --- New Dashboard Components ---

const DashboardHeader: React.FC<{ user: User, onSettings: () => void, onBack?: () => void, showBack?: boolean }> = ({ user, onSettings, onBack, showBack }) => (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-black/80 backdrop-blur-xl">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
                {showBack && onBack ? (
                    <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                    </button>
                ) : (
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/20">N</div>
                )}
                <h1 className="text-xl font-bold tracking-tight text-white">Nex<span className="text-indigo-400">iro</span></h1>
            </div>
            <div className="flex items-center gap-4">
                <div className="text-xs text-gray-400 hidden sm:block">
                    {user.email}
                </div>

                {/* Credit Display */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                    <span className={`text-xs font-bold ${user.credits < 5 ? 'text-red-400' : 'text-indigo-300'}`}>
                        {user.credits} Credits Left
                    </span>
                </div>

                {/* Settings Button */}
                <button
                    onClick={onSettings}
                    className="p-2 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                    title="Settings"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </button>
            </div>
        </div>
    </header>
);

// --- ServicesMenu Component ---
const ServicesMenu: React.FC<{ onSelect: (service: 'food' | 'product') => void }> = ({ onSelect }) => (
    <div className="max-w-6xl mx-auto px-6 py-20 w-full animate-fade-in">
        <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Select Your Studio</h2>
            <p className="text-gray-400 text-lg">Choose the specialized AI photography agent for your needs.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <button
                onClick={() => onSelect('food')}
                className="group relative p-10 rounded-[2.5rem] bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-orange-500/50 hover:bg-orange-500/5 transition-all duration-500 text-left overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-orange-500/20 transition-all duration-500"></div>
                <div className="relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center mb-8 text-3xl group-hover:scale-110 transition-transform duration-500">
                        🍔
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-3 group-hover:text-orange-400 transition-colors">Food Photography</h3>
                    <p className="text-gray-400 text-base leading-relaxed">
                        Transform snapshots into mouth-watering, Michelin-star quality visuals. Optimized for textures, plating, and appetizing lighting.
                    </p>
                    <div className="mt-8 flex items-center text-orange-400 font-bold text-sm tracking-wide uppercase opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        Enter Studio <span className="ml-2">→</span>
                    </div>
                </div>
            </button>

            <button
                onClick={() => onSelect('product')}
                className="group relative p-10 rounded-[2.5rem] bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all duration-500 text-left overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-500/20 transition-all duration-500"></div>
                <div className="relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-8 text-3xl group-hover:scale-110 transition-transform duration-500">
                        🧴
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors">Product Photography</h3>
                    <p className="text-gray-400 text-base leading-relaxed">
                        Create high-end commercial product shots. Perfect for e-commerce, catalogs, and advertising campaigns with controlled lighting.
                    </p>
                    <div className="mt-8 flex items-center text-indigo-400 font-bold text-sm tracking-wide uppercase opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        Enter Studio <span className="ml-2">→</span>
                    </div>
                </div>
            </button>
        </div>
    </div>
);

// --- EnhanceTool Component ---
interface EnhanceToolProps {
    user: User;
    onUpdateUser: (u: User) => void;
    onError: (msg: string) => void;
    errorMsg: string;
    onUpgradeRequired: () => void;
    toolType: ToolType;
}

const EnhanceTool: React.FC<EnhanceToolProps> = ({
    user, onUpdateUser, onError, errorMsg, onUpgradeRequired, toolType
}) => {
    // Assets
    const [sourceImage, setSourceImage] = useState<ImageAsset | null>(null);
    const [referenceImage, setReferenceImage] = useState<ImageAsset | null>(null);
    const [stylePrompt, setStylePrompt] = useState("");
    const [productDescription, setProductDescription] = useState("");
    const [customBgImage, setCustomBgImage] = useState<ImageAsset | null>(null);

    // Analysis State
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [subjectDetails, setSubjectDetails] = useState("");

    // Generation State
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Settings State
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
    const [quality, setQuality] = useState<ImageQuality>('1K');
    const [backgroundMode, setBackgroundMode] = useState<BackgroundMode>(BackgroundMode.REFERENCE_STYLE);
    const [backgroundColor, setBackgroundColor] = useState("#ffffff");
    const [cameraAngle, setCameraAngle] = useState<CameraAngle>(CameraAngle.EYE_LEVEL);
    const [usageScenario, setUsageScenario] = useState<UsageScenario>(UsageScenario.SOCIAL_LIFESTYLE);
    const [customInstructions, setCustomInstructions] = useState("");

    // Reset when tool type changes
    useEffect(() => {
        setSourceImage(null);
        setReferenceImage(null);
        setGeneratedImage(null);
        setStylePrompt("");
        setProductDescription("");
        setSubjectDetails("");
        onError("");
    }, [toolType, onError]);

    const handleSourceImageChange = async (img: ImageAsset | null) => {
        setSourceImage(img);
        if (img) {
            setIsAnalyzing(true);
            try {
                const result = await analyzeImage(img.base64, toolType);
                setSubjectDetails(result.details);
            } catch (e) {
                console.error("Analysis failed", e);
            } finally {
                setIsAnalyzing(false);
            }
        } else {
            setSubjectDetails("");
        }
    };

    const handleGenerate = async () => {
        if (!sourceImage) return;

        // Check credits
        const cost = referenceImage ? 4 : 1;
        if (user.credits < cost) {
            onUpgradeRequired();
            return;
        }

        setIsProcessing(true);
        onError("");

        try {
            // 1. Deduct credits (optimistic or actual)
            const updatedUser = await authService.consumeCredits(user.email, cost);
            onUpdateUser(updatedUser);

            // 2. Prepare options
            const styleInput: StyleInput = referenceImage
                ? { type: 'IMAGE', data: referenceImage.base64 }
                : { type: 'TEXT', description: stylePrompt || "Professional studio lighting, high end commercial photography" };

            const options: EnhancementOptions = {
                toolType,
                aspectRatio,
                quality,
                backgroundMode,
                customBackground: customBgImage?.base64,
                backgroundColor,
                cameraAngle,
                usageScenario,
                customInstructions: customInstructions,
                productDescription: productDescription || undefined,
                detectedSubjectDetails: subjectDetails || undefined
            };

            // 3. Call API
            const resultBase64 = await enhanceImage(sourceImage.base64, styleInput, options);
            setGeneratedImage(`data:image/jpeg;base64,${resultBase64}`);

        } catch (err: any) {
            console.error(err);
            onError(err.message || "Generation failed");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
            {/* Left Column: Controls */}
            <div className="lg:col-span-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">

                {/* 1. ASSETS */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-xs">1</span>
                        Upload Source
                    </h3>
                    <ImageUploader
                        label="Source Image"
                        subLabel={toolType === 'FOOD' ? 'Plate of food' : 'Product item'}
                        image={sourceImage}
                        onImageChange={handleSourceImageChange}
                        disabled={isProcessing}
                    />

                    <div className="grid gap-2">
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Subject Name</label>
                            <input
                                type="text"
                                value={productDescription}
                                onChange={(e) => setProductDescription(e.target.value)}
                                placeholder={toolType === 'FOOD' ? "e.g. Double Cheeseburger" : "e.g. Chanel No.5 Perfume"}
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white outline-none focus:border-indigo-500"
                                disabled={isProcessing}
                            />
                        </div>

                        {(isAnalyzing || subjectDetails) && (
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">
                                    {isAnalyzing ? "Analyzing Details..." : "Locked Details (AI Detected)"}
                                </label>
                                <textarea
                                    value={subjectDetails}
                                    onChange={(e) => setSubjectDetails(e.target.value)}
                                    className="w-full bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-2 text-xs text-gray-300 outline-none h-16 resize-none"
                                    disabled={isAnalyzing || isProcessing}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. STYLE */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-xs">2</span>
                        Define Style
                    </h3>

                    <div className="p-1 bg-white/5 rounded-xl flex">
                        <button
                            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${!referenceImage ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
                            onClick={() => { setReferenceImage(null); }}
                        >
                            Text Prompt
                        </button>
                        <button
                            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${referenceImage ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
                            onClick={() => { /* Switch logic implicit */ }}
                        >
                            Image Reference
                        </button>
                    </div>

                    <ImageUploader
                        label="Style Reference (Optional)"
                        subLabel="Match this look"
                        image={referenceImage}
                        onImageChange={setReferenceImage}
                        disabled={isProcessing}
                    />

                    <textarea
                        value={stylePrompt}
                        onChange={(e) => setStylePrompt(e.target.value)}
                        disabled={isProcessing || !!referenceImage}
                        placeholder={referenceImage ? "Using reference image..." : "Describe the lighting, mood, and environment..."}
                        className={`w-full h-24 bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 outline-none resize-none transition-all ${referenceImage ? 'opacity-50' : ''}`}
                    />
                </div>

                {/* 3. SETTINGS */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-xs">3</span>
                        Settings
                    </h3>

                    {/* Composition Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Aspect Ratio</label>
                            <select
                                value={aspectRatio}
                                onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white outline-none focus:border-indigo-500"
                            >
                                <option value="1:1">1:1 (Square)</option>
                                <option value="9:16">9:16 (Story)</option>
                                <option value="16:9">16:9 (Landscape)</option>
                                <option value="4:5">4:5 (Portrait)</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Quality</label>
                            <select
                                value={quality}
                                onChange={(e) => setQuality(e.target.value as ImageQuality)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white outline-none focus:border-indigo-500"
                            >
                                <option value="1K">1K (Fast)</option>
                                <option value="2K">2K (Balanced)</option>
                                <option value="4K">4K (High Res)</option>
                            </select>
                        </div>
                    </div>

                    {/* Angle & Scenario Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Camera Angle</label>
                            <select
                                value={cameraAngle}
                                onChange={(e) => setCameraAngle(e.target.value as CameraAngle)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white outline-none focus:border-indigo-500"
                            >
                                <option value={CameraAngle.EYE_LEVEL}>Eye Level (0°)</option>
                                <option value={CameraAngle.FORTY_FIVE}>Standard (45°)</option>
                                <option value={CameraAngle.TOP_DOWN}>Flat Lay (90°)</option>
                                <option value={CameraAngle.MACRO}>Macro</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Usage Scenario</label>
                            <select
                                value={usageScenario}
                                onChange={(e) => setUsageScenario(e.target.value as UsageScenario)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white outline-none focus:border-indigo-500"
                            >
                                <option value={UsageScenario.SOCIAL_LIFESTYLE}>Social Media</option>
                                <option value={UsageScenario.ECOMMERCE_MENU}>{toolType === 'FOOD' ? 'Menu' : 'E-Commerce'}</option>
                                <option value={UsageScenario.WEBSITE_HERO}>Website Hero</option>
                            </select>
                        </div>
                    </div>

                    {/* Background Row */}
                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Background</label>
                        <select
                            value={backgroundMode}
                            onChange={(e) => setBackgroundMode(e.target.value as BackgroundMode)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white outline-none focus:border-indigo-500"
                        >
                            <option value={BackgroundMode.REFERENCE_STYLE}>Match Style Reference</option>
                            <option value={BackgroundMode.TRANSPARENT}>Transparent</option>
                            <option value={BackgroundMode.COLOR}>Solid Color</option>
                            <option value={BackgroundMode.KEEP_ORIGINAL}>Keep Original</option>
                            <option value={BackgroundMode.CUSTOM}>Custom Image</option>
                        </select>
                    </div>

                    {backgroundMode === BackgroundMode.COLOR && (
                        <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg border border-white/10">
                            <input
                                type="color"
                                value={backgroundColor}
                                onChange={(e) => setBackgroundColor(e.target.value)}
                                className="w-8 h-8 rounded cursor-pointer bg-transparent border-none"
                            />
                            <span className="text-sm text-gray-300 font-mono">{backgroundColor}</span>
                        </div>
                    )}

                    {backgroundMode === BackgroundMode.CUSTOM && (
                        <ImageUploader
                            label="Custom Background"
                            subLabel="Upload environment"
                            image={customBgImage}
                            onImageChange={setCustomBgImage}
                            disabled={isProcessing}
                        />
                    )}

                    {/* Custom Instructions */}
                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Custom Instructions</label>
                        <textarea
                            value={customInstructions}
                            onChange={(e) => setCustomInstructions(e.target.value)}
                            disabled={isProcessing}
                            placeholder="Specific constraints (e.g., 'no green leaves', 'make lighting warmer')..."
                            className="w-full h-16 bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                        />
                    </div>
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={isProcessing || !sourceImage || (backgroundMode === BackgroundMode.CUSTOM && !customBgImage)}
                    className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                    {isProcessing ? (
                        <>
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            Enhancing...
                        </>
                    ) : (
                        <>Generate <span className="text-xs bg-black/20 px-2 py-0.5 rounded-full">{referenceImage ? '4 Credits' : '1 Credit'}</span></>
                    )}
                </button>

                {errorMsg && <p className="text-red-400 text-sm text-center">{errorMsg}</p>}
            </div>

            {/* Right Column: Preview */}
            <div className="lg:col-span-2 bg-black/40 border border-white/10 rounded-3xl p-6 flex flex-col relative">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-300">Preview</h3>
                    {generatedImage && (
                        <div className="flex gap-2">
                            <a
                                href={generatedImage}
                                download={`nexiro-${toolType.toLowerCase()}-${Date.now()}.jpg`}
                                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                Download
                            </a>
                        </div>
                    )}
                </div>

                <div className="flex-grow bg-white/5 rounded-2xl flex items-center justify-center overflow-hidden relative group">
                    {generatedImage ? (
                        <img src={generatedImage} alt="Result" className="max-w-full max-h-full object-contain" />
                    ) : (
                        <div className="text-center text-gray-500">
                            <div className="w-16 h-16 rounded-full bg-white/5 mx-auto mb-4 flex items-center justify-center">
                                <svg className="w-8 h-8 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            </div>
                            <p>Generated image will appear here</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const Dashboard: React.FC<{ user: User; onUpdateUser: (u: User) => void }> = ({ user, onUpdateUser }) => {
    const [currentView, setCurrentView] = useState<'menu' | 'food' | 'product' | 'settings'>('menu');
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
                onSettings={() => setCurrentView('settings')}
                showBack={currentView !== 'menu'}
                onBack={() => setCurrentView('menu')}
            />

            <main className="flex-grow w-full relative z-10 flex flex-col items-center">
                {currentView === 'menu' && (
                    <ServicesMenu onSelect={(service) => {
                        if (service === 'food' || service === 'product') setCurrentView(service as any);
                    }} />
                )}

                {currentView === 'settings' && (
                    <SettingsPage user={user} onUpdateUser={onUpdateUser} />
                )}

                {(currentView === 'food' || currentView === 'product') && (
                    <div className="max-w-[1600px] mx-auto px-6 py-4 w-full flex-grow flex flex-col">
                        <EnhanceTool
                            user={user}
                            onUpdateUser={onUpdateUser}
                            onError={setToolError}
                            errorMsg={toolError}
                            onUpgradeRequired={() => setShowUpgradeModal(true)}
                            toolType={currentView === 'food' ? 'FOOD' : 'PRODUCT'}
                        />
                    </div>
                )}
            </main>

            <Footer />

            {/* Gradient Bottom Strip */}
            <div className={`w-full h-1 bg-gradient-to-r opacity-50 ${currentView === 'product' ? 'from-pink-500 via-purple-500 to-indigo-500' : 'from-indigo-500 via-purple-500 to-pink-500'}`}></div>
        </div>
    );
};

// --- Landing Page ---
const LandingPage: React.FC<{ onLogin: () => void; onSignup: () => void }> = ({ onLogin, onSignup }) => (
    <div className="min-h-screen relative overflow-hidden bg-black text-white flex flex-col">
        <BackgroundBlobs />

        {/* Nav */}
        <nav className="relative z-10 w-full max-w-[1600px] mx-auto px-6 py-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold tracking-tight">Nex<span className="text-indigo-400">iro</span></h1>
            <div className="flex gap-4">
                <button onClick={onLogin} className="text-sm font-semibold hover:text-indigo-400 transition-colors">Log In</button>
                <button onClick={onSignup} className="px-4 py-2 bg-white text-black text-sm font-bold rounded-full hover:bg-gray-200 transition-colors">Sign Up</button>
            </div>
        </nav>

        {/* Hero */}
        <main className="relative z-10 flex-grow flex flex-col items-center justify-center text-center px-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm animate-fade-in-up">
                <span className="flex h-2 w-2 rounded-full bg-green-400"></span>
                <span className="text-xs font-medium text-gray-300">Gemini 3 Pro + 8K Rendering</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-8 max-w-4xl bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
                AI Photography <br /> for Professionals.
            </h1>

            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-12 leading-relaxed">
                Transform casual snapshots into commercial-grade product and food photography.
                Controlled lighting, material physics, and 8K fidelity.
            </p>

            <div className="flex flex-col md:flex-row gap-4 w-full max-w-md">
                <button onClick={onSignup} className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25 transition-all transform hover:scale-105">
                    Start Creating Free
                </button>
                <button className="flex-1 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-xl backdrop-blur-sm transition-all">
                    View Showcase
                </button>
            </div>
        </main>

        <Footer />
    </div>
);

// --- Pricing/Plan Selection Page ---
const PricingPage: React.FC<{ user: User, onSelectPlan: (priceId: string) => void }> = ({ user, onSelectPlan }) => (
    <div className="min-h-screen bg-black text-white relative overflow-hidden flex flex-col items-center justify-center p-6">
        <BackgroundBlobs />

        <div className="relative z-10 max-w-5xl w-full animate-fade-in">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">Select Your Plan</h2>
                <p className="text-gray-400">Choose the plan that fits your creative needs.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <PlanCard
                    name="Starter"
                    price="0.50"
                    credits={40}
                    features={["Ideal for small menus", "Standard Gen: 1 Credit", "Reference Style: 4 Credits", "4K Downloads"]}
                    onSelect={() => onSelectPlan('price_1SoPnLLUvj13gMgzxPDK2w7m')}
                    selected={false}
                    actionLabel="Get Starter"
                    onAction={() => onSelectPlan('price_1SoPnLLUvj13gMgzxPDK2w7m')}
                />
                <PlanCard
                    name="Pro"
                    price="1.00"
                    credits={150}
                    features={["Ideal for agencies & catalogs", "Standard Gen: 1 Credit", "Reference Style: 4 Credits", "Priority Processing", "Commercial License"]}
                    onSelect={() => onSelectPlan('price_1SoPnMLUvj13gMgzsvTrTkrl')}
                    selected={false}
                    bestValue={true}
                    actionLabel="Get Pro"
                    onAction={() => onSelectPlan('price_1SoPnMLUvj13gMgzsvTrTkrl')}
                />
            </div>

            <div className="mt-8 text-center text-gray-500 text-sm">
                <button onClick={() => window.location.reload()} className="underline hover:text-gray-400">Back to Login</button>
            </div>
        </div>
    </div>
);

// --- Auth Page ---
const AuthPage: React.FC<{ initialMode: 'login' | 'signup', onAuthSuccess: (user: User) => void, onBack: () => void }> = ({ initialMode, onAuthSuccess, onBack }) => {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden flex items-center justify-center p-6">
            <BackgroundBlobs />

            <button onClick={onBack} className="absolute top-8 left-8 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors z-20">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </button>

            <div className="w-full max-w-md bg-[#111] border border-white/10 p-8 rounded-3xl relative z-10 shadow-2xl shadow-indigo-500/10">
                <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-xl font-bold mb-4 mx-auto shadow-lg shadow-indigo-500/20">N</div>
                    <h2 className="text-2xl font-bold mb-2">Welcome to Nexiro</h2>
                    <p className="text-gray-400 text-sm">
                        {'Sign in to access your professional AI studio.'}
                    </p>
                </div>

                <div className="mt-6 flex justify-center">
                    <GoogleLogin
                        onSuccess={async (credentialResponse) => {
                            if (credentialResponse.credential) {
                                setLoading(true);
                                try {
                                    // Default plan 'FREE' is implied if not passed.
                                    const user = await authService.googleLogin(credentialResponse.credential);
                                    onAuthSuccess(user);
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

                {error && <div className="text-red-400 text-sm text-center bg-red-500/10 p-2 rounded-lg mt-4">{error}</div>}
                {loading && <div className="text-indigo-400 text-sm text-center mt-4">Authenticating...</div>}

                <div className="mt-6 text-center">
                    <p className="text-gray-500 text-xs text-center mt-4">
                        By continuing, you agree to our Terms of Service and Privacy Policy.
                    </p>
                </div>
            </div>
        </div>
    );
};

const App: React.FC = () => {
    // Initialize state from potential existing session
    const [user, setUser] = useState<User | null>(authService.getSession());
    const [view, setView] = useState<'landing' | 'auth' | 'pricing'>(() => {
        // If we have a user, default to landing (dashboard). If not, landing (which shows hero).
        // Actually, if user is logged in, we want to show the dashboard, which is rendered conditionally in return.
        return 'landing';
    });

    // Check for success param from Stripe redirect
    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        if (query.get('session_id')) {
            // Clear URL
            window.history.replaceState({}, '', '/');

            // If we have a user in state (optimistic) or if we need to assume global state,
            // we should try to verify. Since 'user' state might be null on reload, 
            // we might need to rely on localStorage or just wait for the user to login.
            // BUT, if the user didn't reload the page manually, 'user' might still be set.

            if (user?.email) {
                // Show loading state or toast
                alert("Payment successful! Verifying your plan...");

                // Add a small delay for webhook
                setTimeout(async () => {
                    try {
                        const updatedUser = await authService.verifyPayment(user.email);
                        setUser(updatedUser);
                        setView('landing'); // Go to dashboard
                        alert("Plan upgraded successfully!");
                    } catch (e) {
                        console.error("Verification failed", e);
                        alert("Payment received, but auto-refresh failed. Please refresh the page.");
                    }
                }, 2000);
            } else {
                // User not in state (maybe page reloaded). 
                // We can't verify without email. Just alert.
                alert("Payment successful! Please sign in to see your new plan.");
            }
        }
    }, [user]); // Add user to dependency so it fires if user loads late

    const handleStripeCheckout = async (priceId: string) => {
        if (!user) return;
        console.log("Initiating Checkout for Price:", priceId);
        if (!priceId) {
            alert("Error: Price ID is missing. Please refresh and try again.");
            return;
        }
        try {
            const API_BASE = import.meta.env.PROD ? '/api' : 'http://localhost:5000/api';
            const response = await fetch(`${API_BASE}/create-checkout-session`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ priceId, email: user.email }),
            });
            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                alert(data.message || "Failed to start checkout");
            }
        } catch (error) {
            console.error("Checkout error:", error);
            alert("Checkout failed");
        }
    };

    if (user) {
        // If user is logged in but on free plan (effectively "no plan" for this flow), show pricing
        if (!user.isPro && view !== 'dashboard' /* Force check? */) {
            return <PricingPage user={user} onSelectPlan={handleStripeCheckout} />;
        }

        return <Dashboard user={user} onUpdateUser={setUser} />;
    }

    if (view === 'auth') {
        return (
            <AuthPage
                initialMode='login' // Mode doesn't matter much now
                onAuthSuccess={(u) => {
                    setUser(u);
                    // If not pro, show pricing
                    if (!u.isPro) {
                        setView('pricing');
                    }
                }}
                onBack={() => setView('landing')}
            />
        );
    }

    return (
        <LandingPage
            onLogin={() => { setView('auth'); }}
            onSignup={() => { setView('auth'); }}
        />
    );
};

export default App;
