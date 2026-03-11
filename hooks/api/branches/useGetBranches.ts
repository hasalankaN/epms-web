import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";
import type { BranchRow, BranchType, BranchStatus } from "@/types/branch";

interface GetBranchesParams {
  page?: number;
  size?: number;
  orderBy?: string;
  order?: "asc" | "desc";
  search?: string;
  branch_type?: BranchType;
  status?: BranchStatus;
}

interface GetBranchesResponse {
  results: BranchRow[];
  totalResults: number;
  page: number;
  size: number;
  totalPages: number;
  isFirstPage: boolean;
  isLastPage: boolean;
}

export function useGetBranches(params: GetBranchesParams) {
  return useQuery<GetBranchesResponse>({
    queryKey: [queryKeys.branches, params],
    queryFn: async () => {
      const response = await api.get(API_ENDPOINTS.branches.GET_ALL, {
        params: {
          page: params.page || 1,
          size: params.size || 10,
          orderBy: params.orderBy || "createdAt",
          order: params.order || "desc",
          ...params,
        },
      });
      
      return response.data.data;
    },
  });
}
