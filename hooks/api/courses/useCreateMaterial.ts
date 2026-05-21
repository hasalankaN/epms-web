import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import type { CommonResponseDataType } from "@/types/common";

export interface CreateMaterialPayload {
  tier_id: string;
  material_type: "VIDEO" | "FILE" | "LINK" | "ZOOM";
  title: string;
  content_url?: string;
  content_text?: string;
  file_name?: string;
  file_format?: string;
  zoom_link?: string;
  zoom_start_time?: string;
  zoom_duration?: number;
}

export interface MaterialResponse {
  id: string;
  tier_id: string;
  material_type: string;
  title: string;
  content_url: string | null;
  content_text: string | null;
  file_name: string | null;
  file_format: string | null;
  zoom_link: string | null;
  zoom_start_time: string | null;
  zoom_duration: number | null;
  created_at: string;
  updated_at: string;
}

export const useCreateMaterial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateMaterialPayload) => {
      const { data } = await api.post<CommonResponseDataType<MaterialResponse>>(
        API_ENDPOINTS.lecturer.CONTENT_MATERIALS,
        payload
      );

      return data;
    },
    onSuccess: (response) => {
      if (response.status === "SUCCESS") {
        toast.success("Material added successfully!");

        // Refresh tiers structure to show new material
        queryClient.invalidateQueries({ queryKey: ["course-tiers"] });
      }
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Failed to add material.";
      
      toast.error(errorMessage);
    },
  });
};
