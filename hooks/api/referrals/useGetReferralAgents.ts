import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";
import type { 
  GetReferralAgentsParams, 
  GetReferralAgentsResponse 
} from "@/types/referral";

export function useGetReferralAgents(params: GetReferralAgentsParams) {
  // Clean params - only include defined values
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== "")
  );

  return useQuery<GetReferralAgentsResponse>({
    queryKey: [queryKeys.referrals, cleanParams],
    queryFn: async () => {
      const apiParams: Record<string, any> = {
        page: params.page || 1,
        size: params.size || 20,
        orderBy: params.orderBy || "createdAt",
        order: params.order || "desc",
      };

      // Add optional params
      if (params.search) apiParams.search = params.search;
      if (params.district) apiParams.district = params.district;
      if (params.status) apiParams.status = params.status;

      const response = await api.get(API_ENDPOINTS.referrals.GET_AGENTS, {
        params: apiParams,
      });
      
      return response.data.data;
    },
  });
}
