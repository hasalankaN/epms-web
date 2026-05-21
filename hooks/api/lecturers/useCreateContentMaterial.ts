import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import type { CommonResponseDataType } from "@/types/common";

export interface CreateContentMaterialRequest {
  tier_id: string;
  material_type: string;
  title: string;
  zoom_link: string;
  zoom_start_time: string;
  zoom_duration: number;
}

export const useCreateContentMaterial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateContentMaterialRequest) => {
      const response = await api.post<CommonResponseDataType<any>>(
        API_ENDPOINTS.lecturer.CONTENT_MATERIALS,
        data
      );

      return response.data;
    },
    onSuccess: () => {
      toast.success("Class scheduled successfully!");
      queryClient.invalidateQueries({ queryKey: ["batch-tiers"] }); // Adjust as needed
      queryClient.invalidateQueries({ queryKey: ["lecturer-dashboard"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to schedule class");
    },
  });
};
