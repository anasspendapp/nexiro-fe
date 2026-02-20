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
      if (data.token) {
        localStorage.setItem("nexiro_token", data.token);
      }
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
      if (data.token) {
        localStorage.setItem("nexiro_token", data.token);
      }
    },
  });
};

export const useGetCurrentUser = () => {
  return useMutation({
    mutationFn: () => authAPI.getCurrentUser(),
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
// Usage Hooks
// ============================================

export const useConsumeCredits = () => {
  return useMutation({
    mutationFn: (amount: number) => usageAPI.consumeCredits(amount),
  });
};

export const useUsageHistory = (userId: number, options?: UseQueryOptions) => {
  return useQuery({
    queryKey: ["usage-history", userId],
    queryFn: () => usageAPI.getHistory(userId),
    enabled: !!userId,
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

export const useImageHistory = (userId: number, options?: UseQueryOptions) => {
  return useQuery({
    queryKey: ["image-history", userId],
    queryFn: () => imageAPI.getImageHistory(userId),
    enabled: !!userId,
    ...options,
  });
};
