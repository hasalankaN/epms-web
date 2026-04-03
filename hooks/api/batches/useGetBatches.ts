import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";
import type { ApiBatchRow } from "@/types/batch";

export interface GetBatchesParams {
  page?: number;
  size?: number;
  orderBy?: string;
  order?: "asc" | "desc";
  search?: string;
  category?: string;
  type?: string;
  status?: string;
  branch_id?: string;
  payment_type?: string;
  start_date_from?: string;
  start_date_to?: string;
  level?: string;
  lecturer_id?: string;
}

export interface GetBatchesResponse {
  results: ApiBatchRow[];
  totalResults: number;
  page: number;
  size: number;
  totalPages: number;
  isFirstPage: boolean;
  isLastPage: boolean;
}

export function useGetBatches(params: GetBatchesParams) {
  // Clean params - only include defined values
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== "")
  );

  return useQuery<GetBatchesResponse>({
    queryKey: [queryKeys.batches, cleanParams],
    queryFn: async () => {
      const apiParams: Record<string, any> = {
        page: params.page || 1,
        size: params.size || 10,
        orderBy: params.orderBy || "createdAt",
        order: params.order || "desc",
      };

      // Add optional params
      if (params.search) apiParams.search = params.search;
      if (params.category) apiParams.category = params.category;
      if (params.type) apiParams.type = params.type;
      if (params.status) apiParams.status = params.status;
      if (params.branch_id) apiParams.branch_id = params.branch_id;
      if (params.payment_type) apiParams.payment_type = params.payment_type;
      if (params.start_date_from) apiParams.start_date_from = params.start_date_from;
      if (params.start_date_to) apiParams.start_date_to = params.start_date_to;
      if (params.level) apiParams.level = params.level;
      if (params.lecturer_id) apiParams.lecturer_id = params.lecturer_id;

      const response = await api.get(API_ENDPOINTS.batches.GET_ALL, {
        params: apiParams,
      });

      return response.data.data;
    },
  });
}
