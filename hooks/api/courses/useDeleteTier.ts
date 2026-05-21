import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import type { CommonResponseDataType } from "@/types/common";

export const useDeleteTier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete<CommonResponseDataType<{ success: boolean }>>(
        API_ENDPOINTS.lecturer.CONTENT_TIER(id)
      );

      return data;
    },
    onSuccess: (response) => {
      if (response.status === "SUCCESS") {
        toast.success("Tier deleted successfully!");

        // Refresh tiers structure
        queryClient.invalidateQueries({ queryKey: ["course-tiers"] });
      }
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Failed to delete tier.";
      
      toast.error(errorMessage);
    },
  });
};
