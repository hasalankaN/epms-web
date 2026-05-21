import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import type { CommonResponseDataType } from "@/types/common";

export interface Material {
  id: string;
  tier_id: string;
  material_type: "VIDEO" | "FILE" | "LINK" | "ZOOM";
  title: string;
  content_url: string | null;
  content_text: string | null;
  file_name: string | null;
  file_format: string | null;
  zoom_link: string | null;
  zoom_start_time: string | null;
  zoom_duration: number | null;
  display_order: number;
  created_by_user_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export const useGetTierMaterials = (tierId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["tier-materials", tierId],
    queryFn: async () => {
      const { data } = await api.get<CommonResponseDataType<Material[]>>(
        API_ENDPOINTS.learning.TIER_MATERIALS(tierId)
      );
      
      return data.data;
    },
    enabled: !!tierId && enabled,
  });
};
