"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { login } from "@/lib/authentication";
import { useAuthStore } from "@/store/authStore";
import type { LoginRequest, LoginResponseData } from "@/types/dto/auth.dto";
import type { CommonResponseDataType } from "@/types/common";
import { ROLE_PANEL_MAP, type UserRole } from "@/types/roles";

export const useLoginMutation = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuthData = useAuthStore((state) => state.setAuthData);

  return useMutation<
    CommonResponseDataType<LoginResponseData | null>,
    Error,
    LoginRequest
  >({
    mutationFn: async (credentials: LoginRequest) => {
      const result = await login(credentials);

      if (result.status === "FAIL" || !result.data) {
        throw new Error(result.message || "Invalid username or password. Please check your details and try again.");
      }

      return result;
    },
    onSuccess: (data) => {
      if (!data.data) return;

      setAuthData(data.data);
      toast.success("Login successful!");

      const callbackUrl = searchParams.get("callbackUrl");

      if (callbackUrl) {
        router.push(callbackUrl);
        
return;
      }

      const role = data.data.user.role as UserRole;
      const targetPanel = ROLE_PANEL_MAP[role] || "/admin-panel";

      router.push(`${targetPanel}/dashboard`);
    },
    onError: (error) => {
      toast.error(error.message || "An unexpected error occurred during login.");
    },
  });
};

export const clearAuthData = () => {
  useAuthStore.getState().clearAuthData();
};
