import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/lib/axios";
import type { CommonResponseDataType } from "@/types/common";

export interface CreateTierPayload {
  course_id: string;
  parent_tier_id?: string | null;
  title: string;
  description: string;
}

export interface TierResponse {
  id: string;
  course_id: string;
  batch_id: string | null;
  parent_tier_id: string | null;
  level: number;
  title: string;
  description: string;
  is_enabled: boolean;
  unlock_after_installment: number | null;
  display_order: number;
  created_by_user_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export const useCreateTier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateTierPayload) => {
      const { data } = await api.post<CommonResponseDataType<TierResponse>>(
        "/api/v1/lecturer/content/tiers",
        payload
      );
      return data;
    },
    onSuccess: (response) => {
      if (response.status === "SUCCESS") {
        toast.success("Tier created successfully!");
        // Invalidate course-tiers queries to refresh structure
        queryClient.invalidateQueries({ queryKey: ["course-tiers"] });
      }
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Failed to create tier.";
      toast.error(errorMessage);
    },
  });
};
