"use client";

import { useRouter } from "next/navigation";

import { useMutation } from "@tanstack/react-query";

import { toast } from "sonner";

import { login } from "@/lib/authentication";
import type { LoginRequest } from "@/types/dto/auth.dto";
import { useAuthStore } from "@/store/authStore";

export const { getAuthData, clearAuthData } = useAuthStore.getState();

/**
 * Convert API error messages to user-friendly messages
 */
function getFriendlyErrorMessage(errorMessage: string): string {
  const errorMap: Record<string, string> = {
    'INVALID_LOGIN_CREDENTIALS': 'Invalid email or password. Please try again.',
  };

  // Check if error message matches any known error code
  const friendlyMessage = errorMap[errorMessage.toUpperCase().trim()];
  
  if (friendlyMessage) {
    return friendlyMessage;
  }

  // If it's a code-like message (ALL_CAPS_WITH_UNDERSCORES), make it friendly
  if (/^[A-Z_]+$/.test(errorMessage.trim())) {
    return 'Unable to log in. Please check your credentials and try again.';
  }

  // Return the original message if it's already user-friendly
  return errorMessage || 'An unexpected error occurred. Please try again.';
}

export function useLoginMutation() {
  const router = useRouter();
  const setAuthData = useAuthStore((state) => state.setAuthData);

  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      const result = await login(data);

      if (result.status === "FAIL") {
        throw new Error(result.message ?? "Invalid email or password.");
      }

      // Store auth response in Zustand store (persisted to sessionStorage)
      if (result.data) {
        setAuthData(result.data);
      }

return result;
    },
    onSuccess: (result) => {
      toast.success("Logged in successfully.");

      // Check for callbackUrl in the current URL
      const params = new URLSearchParams(window.location.search);
      const callbackUrl = params.get("callbackUrl");

      if (callbackUrl && callbackUrl.startsWith("/")) {
        router.push(callbackUrl);

        return;
      }

      // Redirect to the user's panel dashboard based on role
      let rolePrefix = result.data?.user?.role?.toLowerCase() ?? "admin";
      
      if (rolePrefix === "referral_agent") {
        rolePrefix = "referral";
      }
      
      router.push(`/${rolePrefix}-panel/dashboard`);
    },
    onError: (error) => {
      // Convert error message to user-friendly version
      const friendlyMessage = getFriendlyErrorMessage(error.message);
      
      toast.error(friendlyMessage);
      console.error("Login mutation failed:", error.message);
    },
  });
}