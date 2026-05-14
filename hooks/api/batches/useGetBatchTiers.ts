import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import type { CommonResponseDataType } from "@/types/common";
import { queryKeys } from "@/lib/constants/queryKeys";

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

export const useGetBatchTiers = (batchId: string) => {
  return useQuery({
    queryKey: ["batch-tiers", batchId],
    queryFn: async () => {
      const { data } = await api.get<CommonResponseDataType<TierNode[]>>(
        `/api/v1/admin/learning/tiers`,
        {
          params: {
            owner_type: "BATCH",
            owner_id: batchId,
          },
        }
      );
      return data.data;
    },
    enabled: !!batchId,
  });
};
