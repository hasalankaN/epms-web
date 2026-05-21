import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import type { CommonResponseDataType } from "@/types/common";

export interface AgentCommissionItem {
  id: string;
  date: string;
  student_name: string | null;
  source_name: string | null;
  amount: string;
  rate: string;
  status: string;
}

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

export const useGetReferralAgentCourses = (agentId: string | null, page = 1, size = 10) => {
  return useQuery({
    queryKey: ["referral-agent-courses", agentId, page, size],
    queryFn: async () => {
      if (!agentId) return null;

      const { data } = await api.get<CommonResponseDataType<CommissionResponse>>(
        API_ENDPOINTS.referrals.AGENT_COURSES(agentId),
        { params: { page, size } }
      );

      return data.data;
    },
    enabled: !!agentId,
  });
};
