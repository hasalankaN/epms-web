import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";
import type { ReferralAgentSummaryResponse } from "@/types/referral";

export function useGetReferralAgentSummary(id: string | null) {
  return useQuery({
    queryKey: [queryKeys.referrals, id, "summary"],
    queryFn: async () => {
      if (!id) return null;

      const response = await api.get<{
        status: string;
        message: string | null;
        data: ReferralAgentSummaryResponse;
      }>(API_ENDPOINTS.referrals.GET_SUMMARY(id));

      return response.data.data;
    },
    enabled: !!id,
  });
}
