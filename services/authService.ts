import { User, PlanType } from "../types";
import {
  authAPI,
  subscriptionAPI,
  usageAPI,
  userAPI,
  transformUserData,
} from "./api";

export const API_URL = "https://api.nexiro.io/api";

/**
 * Auth Service
 */
export const authService = {
  // Session Persistence
  saveSession(user: User) {
    console.log("Saving user to localStorage:", user);
    localStorage.setItem("nexiro_user", JSON.stringify(user));
  },

  getSession(): User | null {
    const data = localStorage.getItem("nexiro_user");
    const user = data ? JSON.parse(data) : null;
    console.log("Retrieved user from localStorage:", user);
    return user;
  },

  clearSession() {
    localStorage.removeItem("nexiro_user");
  },

  /**
   * Login with email and password
   */
  async login(email: string, password: string): Promise<User> {
    const data = await authAPI.login(email, password);
    const user = transformUserData(data.user);
    this.saveSession(user);
    return user;
  },

  /**
   * Google OAuth login
   */
  async googleLogin(token: string, plan?: PlanType): Promise<User> {
    const data = await authAPI.googleAuth(token, plan);
    const user = transformUserData(data.user);
    this.saveSession(user);
    return user;
  },

  /**
   * Sign up new user
   */
  async signup(email: string, password: string): Promise<User> {
    const data = await authAPI.signup(email, password);
    const user = transformUserData(data.user);
    this.saveSession(user);
    return user;
  },

  /**
   * Get current user from backend
   */
  async getCurrentUser(email: string): Promise<User> {
    const data = await authAPI.getCurrentUser(email);
    const user = transformUserData(data.user);
    this.saveSession(user);
    return user;
  },

  /**
   * Consume credits for image processing
   */
  async consumeCredits(email: string, amount: number): Promise<User> {
    const data = await usageAPI.consumeCredits(email, amount);
    // Backend should return updated user with new creditBalance
    const user = transformUserData(data.user || data);
    this.saveSession(user);
    return user;
  },

  /**
   * Upgrade user plan
   */
  async upgradePlan(email: string): Promise<User> {
    const data = await subscriptionAPI.upgradePlan(email);
    const user = transformUserData(data.user);
    this.saveSession(user);
    return user;
  },

  /**
   * Cancel subscription
   */
  async cancelSubscription(email: string): Promise<User> {
    const data = await subscriptionAPI.cancelSubscription(email);
    const user = transformUserData(data.user);
    this.saveSession(user);
    return user;
  },

  /**
   * Update user profile
   */
  async updateProfile(userId: string, newPassword?: string): Promise<User> {
    const data = await userAPI.updateProfile(userId, { password: newPassword });
    const user = transformUserData(data.user);
    this.saveSession(user);
    return user;
  },

  /**
   * Get user credits
   */
  async getCredits(userId: string): Promise<number> {
    const data = await userAPI.getCredits(userId);
    return data.credits;
  },
};
