import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";
import type { BranchType, BranchStatus } from "@/types/branch";

export interface BranchDetailResponse {
  status: string;
  message: string | null;
  data: {
    id: string;
    branch_code: string;
    name: string;
    email: string;
    phone: string;
    whatsapp: string;
    address: string;
    branch_type: BranchType;
    manager_user_id: string | null;
    status: BranchStatus;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  };
}

export function useGetBranchById(id: string | null) {
  return useQuery({
    queryKey: [queryKeys.branches, id],
    queryFn: async () => {
      if (!id) return null;

      const response = await api.get<BranchDetailResponse>(
        API_ENDPOINTS.branches.GET_BY_ID(id)
      );
      
      return response.data.data;
    },
    enabled: !!id,
  });
}
