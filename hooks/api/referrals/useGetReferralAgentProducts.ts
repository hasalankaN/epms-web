import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import type { CommonResponseDataType } from "@/types/common";
import type { AgentCommissionItem } from "./useGetReferralAgentCourses";

interface CommissionResponse {
  results: AgentCommissionItem[];
  totalResults: number;
  page: number;
  size: number;
  totalPages: number;
  isFirstPage: boolean;
  isLastPage: boolean;
  filtered_total_commissions: number;
}

export const useGetReferralAgentProducts = (agentId: string | null, page = 1, size = 10) => {
  return useQuery({
    queryKey: ["referral-agent-products", agentId, page, size],
    queryFn: async () => {
      if (!agentId) return null;

      const { data } = await api.get<CommonResponseDataType<CommissionResponse>>(
        API_ENDPOINTS.referrals.AGENT_PRODUCTS(agentId),
        { params: { page, size } }
      );

      return data.data;
    },
    enabled: !!agentId,
  });
};
