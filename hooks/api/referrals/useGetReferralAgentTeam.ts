import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import type { CommonResponseDataType } from "@/types/common";

export interface AgentTeamMember {
  id: string;
  created_at: string;
  member_code: string;
  name: string;
  role: string;
  total_commissions_received: string;
}

interface PaginatedResponse<T> {
  results: T[];
  totalResults: number;
  page: number;
  size: number;
  totalPages: number;
  isFirstPage: boolean;
  isLastPage: boolean;
}

export const useGetReferralAgentTeam = (agentId: string | null, page = 1, size = 10) => {
  return useQuery({
    queryKey: ["referral-agent-team", agentId, page, size],
    queryFn: async () => {
      if (!agentId) return null;
      const { data } = await api.get<CommonResponseDataType<PaginatedResponse<AgentTeamMember>>>(
        `/api/v1/admin/referrals/agents/${agentId}/team`,
        { params: { page, size } }
      );
      return data.data;
    },
    enabled: !!agentId,
  });
};
