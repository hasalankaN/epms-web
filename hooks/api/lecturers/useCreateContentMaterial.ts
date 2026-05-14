import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import type { CommonResponseDataType } from "@/types/common";
import { toast } from "sonner";

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
        "/api/v1/lecturer/content/materials",
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
