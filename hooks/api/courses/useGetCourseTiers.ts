import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import type { CommonResponseDataType } from "@/types/common";

export interface TierNode {
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
  children: TierNode[];
}

export const useGetCourseTiers = (courseId: string) => {
  return useQuery({
    queryKey: ["course-tiers", courseId],
    queryFn: async () => {
      const { data } = await api.get<CommonResponseDataType<TierNode[]>>(
        API_ENDPOINTS.learning.TIERS,
        {
          params: {
            owner_type: "COURSE",
            owner_id: courseId,
          },
        }
      );

      return data.data;
    },
    enabled: !!courseId,
  });
};
