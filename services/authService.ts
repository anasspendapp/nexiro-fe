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
  // Token Management
  saveToken(token: string) {
    localStorage.setItem("nexiro_token", token);
  },

  getToken(): string | null {
    return localStorage.getItem("nexiro_token");
  },

  clearToken() {
    localStorage.removeItem("nexiro_token");
  },

  // Session Persistence
  saveSession(user: User, token?: string) {
    console.log("Saving user to localStorage:", user);
    localStorage.setItem("nexiro_user", JSON.stringify(user));
    if (token) {
      this.saveToken(token);
    }
  },

  getSession(): User | null {
    const data = localStorage.getItem("nexiro_user");
    const user = data ? JSON.parse(data) : null;
    console.log("Retrieved user from localStorage:", user);
    return user;
  },

  clearSession() {
    localStorage.removeItem("nexiro_user");
    this.clearToken();
  },

  /**
   * Login with email and password
   */
  async login(email: string, password: string): Promise<User> {
    const data = await authAPI.login(email, password);
    const user = transformUserData(data.user);
    this.saveSession(user, data.token);
    return user;
  },

  /**
   * Google OAuth login
   */
  async googleLogin(token: string, plan?: PlanType): Promise<User> {
    const data = await authAPI.googleAuth(token, plan);
    const user = transformUserData(data.user);
    this.saveSession(user, data.token);
    return user;
  },

  /**
   * Sign up new user
   */
  async signup(email: string, password: string): Promise<User> {
    const data = await authAPI.signup(email, password);
    const user = transformUserData(data.user);
    this.saveSession(user, data.token);
    return user;
  },

  /**
   * Get current user from backend
   */
  async getCurrentUser(): Promise<User> {
    const data = await authAPI.getCurrentUser();
    const user = transformUserData(data.user);
    this.saveSession(user);
    return user;
  },

  /**
   * Get user by ID (using JWT authentication)
   */
  async getUserById(userId: number): Promise<User> {
    const data = await authAPI.getUserById(userId);
    const user = transformUserData(data.user || data);
    this.saveSession(user);
    return user;
  },

  /**
   * Consume credits for image processing
   */
  async consumeCredits(amount: number): Promise<User> {
    const data = await usageAPI.consumeCredits(amount);
    // Backend should return updated user with new creditBalance
    const user = transformUserData(data.user || data);
    this.saveSession(user);
    return user;
  },

  /**
   * Cancel subscription
   */
  async cancelSubscription(): Promise<User> {
    const data = await subscriptionAPI.cancelSubscription();
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
