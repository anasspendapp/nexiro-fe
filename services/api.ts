import axios from "axios";
import { User, PlanType } from "../types";

// API Configuration
export const API_BASE_URL = "http://localhost:3001/api";
// export const API_BASE_URL = "https://api.nexiro.io/api";

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor for adding auth tokens if needed
apiClient.interceptors.request.use(
  (config) => {
    // You can add auth tokens here if needed
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error("API Error:", error.response.data);
    } else if (error.request) {
      // Request was made but no response
      console.error("Network Error:", error.message);
    } else {
      // Something else happened
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  },
);

// ============================================
// Authentication APIs
// ============================================

export const authAPI = {
  /**
   * Login with email and password
   */
  login: async (email: string, password: string) => {
    const response = await apiClient.post("/login", { email, password });
    return response.data;
  },

  /**
   * Sign up new user
   */
  signup: async (email: string, password: string) => {
    const response = await apiClient.post("/signup", { email, password });
    return response.data;
  },

  /**
   * Google OAuth login
   */
  googleAuth: async (token: string, plan?: PlanType) => {
    const response = await apiClient.post("/users/google-auth", {
      token,
      plan,
    });
    return response.data;
  },

  /**
   * Get current user profile (after login/payment)
   */
  getCurrentUser: async (email: string) => {
    const response = await apiClient.post("/users/me", { email });
    return response.data;
  },
};

// ============================================
// User Management APIs
// ============================================

export const userAPI = {
  /**
   * Get current user profile
   */
  getProfile: async (userId: string) => {
    const response = await apiClient.get(`/${userId}`);
    return response.data;
  },

  /**
   * Update user profile
   */
  updateProfile: async (userId: string, data: { password?: string }) => {
    const response = await apiClient.put(`/${userId}`, data);
    return response.data;
  },

  /**
   * Get user credits balance
   */
  getCredits: async (userId: string) => {
    const response = await apiClient.get(`/${userId}/credits`);
    return response.data;
  },
};

// ============================================
// Subscription/Payment APIs
// ============================================

export const subscriptionAPI = {
  /**
   * Create Stripe checkout session
   */
  createCheckoutSession: async (data: {
    priceId: string;
    email: string;
    successUrl: string;
    cancelUrl: string;
  }) => {
    const response = await apiClient.post("/create-checkout-session", data);
    return response.data;
  },

  /**
   * Upgrade user plan to PRO
   */
  upgradePlan: async (email: string) => {
    const response = await apiClient.post("/upgrade", { email });
    return response.data;
  },

  /**
   * Cancel subscription
   */
  cancelSubscription: async (email: string) => {
    const response = await apiClient.post("/cancel-subscription", { email });
    return response.data;
  },
};

// ============================================
// Usage/Credits APIs
// ============================================

export const usageAPI = {
  /**
   * Consume credits for image processing
   */
  consumeCredits: async (email: string, amount: number) => {
    const response = await apiClient.post("/usage", { email, amount });
    return response.data;
  },

  /**
   * Get usage history
   */
  getHistory: async (email: string) => {
    const response = await apiClient.get(`/usage/history/${email}`);
    return response.data;
  },
};

// ============================================
// Image Processing APIs
// ============================================

export const imageAPI = {
  /**
   * Upload image for processing
   */
  uploadImage: async (formData: FormData) => {
    const response = await apiClient.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  /**
   * Get job status
   */
  getJobStatus: async (jobId: string) => {
    const response = await apiClient.get(`/jobs/${jobId}`);
    return response.data;
  },

  /**
   * Get image processing history
   */
  getImageHistory: async (email: string) => {
    const response = await apiClient.get(`/images/history/${email}`);
    return response.data;
  },
};

// ============================================
// Helper Functions
// ============================================

/**
 * Transform backend user data to frontend User type
 */
export const transformUserData = (backendUser: any): User => {
  console.log("Transforming backend user data:", backendUser);

  // Handle plan - backend returns plan object or null
  let userPlan: PlanType = PlanType.FREE;
  if (backendUser.plan && backendUser.plan.name) {
    userPlan = backendUser.plan.name as PlanType;
  } else if (backendUser.planId) {
    // If there's a planId but no plan object, assume PRO for now
    userPlan = PlanType.PRO;
  }

  // Parse creditBalance from string to number
  const credits = backendUser.creditBalance
    ? parseFloat(backendUser.creditBalance)
    : 0;

  const transformedUser = {
    email: backendUser.email,
    credits: credits,
    plan: userPlan,
    isDriveConnected: !!backendUser.googleDriveFolderId,
    isPro: userPlan === PlanType.PRO,
  };

  console.log("Transformed user:", transformedUser);
  return transformedUser;
};
