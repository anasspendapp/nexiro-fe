import { useMutation, useQuery, UseQueryOptions } from "@tanstack/react-query";
import {
  authAPI,
  userAPI,
  subscriptionAPI,
  usageAPI,
  imageAPI,
  transformUserData,
} from "../services/api";
import { User, PlanType } from "../types";

// ============================================
// Authentication Hooks
// ============================================

export const useLogin = () => {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authAPI.login(email, password),
    onSuccess: (data) => {
      const user = transformUserData(data.user);
      localStorage.setItem("nexiro_user", JSON.stringify(user));
    },
  });
};

export const useSignup = () => {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authAPI.signup(email, password),
  });
};

export const useGoogleAuth = () => {
  return useMutation({
    mutationFn: ({ token, plan }: { token: string; plan?: PlanType }) =>
      authAPI.googleAuth(token, plan),
    onSuccess: (data) => {
      const user = transformUserData(data.user);
      localStorage.setItem("nexiro_user", JSON.stringify(user));
    },
  });
};

export const useGetCurrentUser = () => {
  return useMutation({
    mutationFn: (email: string) => authAPI.getCurrentUser(email),
    onSuccess: (data) => {
      const user = transformUserData(data.user);
      localStorage.setItem("nexiro_user", JSON.stringify(user));
    },
  });
};

// ============================================
// User Hooks
// ============================================

export const useUserProfile = (userId: string, options?: UseQueryOptions) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => userAPI.getProfile(userId),
    enabled: !!userId,
    ...options,
  });
};

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: ({ userId, password }: { userId: string; password?: string }) =>
      userAPI.updateProfile(userId, { password }),
  });
};

export const useUserCredits = (userId: string, options?: UseQueryOptions) => {
  return useQuery({
    queryKey: ["credits", userId],
    queryFn: () => userAPI.getCredits(userId),
    enabled: !!userId,
    refetchInterval: 30000, // Refetch every 30 seconds
    ...options,
  });
};

// ============================================
// Subscription Hooks
// ============================================

export const useCreateCheckoutSession = () => {
  return useMutation({
    mutationFn: (data: {
      priceId: string;
      email: string;
      successUrl: string;
      cancelUrl: string;
    }) => subscriptionAPI.createCheckoutSession(data),
  });
};

export const useUpgradePlan = () => {
  return useMutation({
    mutationFn: (email: string) => subscriptionAPI.upgradePlan(email),
  });
};

export const useCancelSubscription = () => {
  return useMutation({
    mutationFn: (email: string) => subscriptionAPI.cancelSubscription(email),
  });
};

// ============================================
// Usage Hooks
// ============================================

export const useConsumeCredits = () => {
  return useMutation({
    mutationFn: ({ email, amount }: { email: string; amount: number }) =>
      usageAPI.consumeCredits(email, amount),
  });
};

export const useUsageHistory = (email: string, options?: UseQueryOptions) => {
  return useQuery({
    queryKey: ["usage-history", email],
    queryFn: () => usageAPI.getHistory(email),
    enabled: !!email,
    ...options,
  });
};

// ============================================
// Image Processing Hooks
// ============================================

export const useUploadImage = () => {
  return useMutation({
    mutationFn: (formData: FormData) => imageAPI.uploadImage(formData),
  });
};

export const useJobStatus = (jobId: string, options?: UseQueryOptions) => {
  return useQuery({
    queryKey: ["job", jobId],
    queryFn: () => imageAPI.getJobStatus(jobId),
    enabled: !!jobId,
    refetchInterval: (data) => {
      // Stop refetching if job is completed or failed
      if (data?.status === "completed" || data?.status === "failed") {
        return false;
      }
      return 2000; // Poll every 2 seconds
    },
    ...options,
  });
};

export const useImageHistory = (email: string, options?: UseQueryOptions) => {
  return useQuery({
    queryKey: ["image-history", email],
    queryFn: () => imageAPI.getImageHistory(email),
    enabled: !!email,
    ...options,
  });
};
