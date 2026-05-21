import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import type { CommonResponseDataType } from "@/types/common";

export interface CreateBatchTierPayload {
  batch_id: string;
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

export const useCreateBatchTier = (batchId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateBatchTierPayload) => {
      const { data } = await api.post<CommonResponseDataType<TierResponse>>(
        API_ENDPOINTS.lecturer.CONTENT_TIERS,
        payload
      );

      return data;
    },
    onSuccess: (response) => {
      if (response.status === "SUCCESS") {
        toast.success("Semester created successfully!");
        queryClient.invalidateQueries({ queryKey: ["batch-tiers", batchId] });
      }
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Failed to create semester.";

      toast.error(errorMessage);
    },
  });
};
