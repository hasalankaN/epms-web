import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

export interface GetBatchSummaryParams {
  date_from?: string;
  date_to?: string;
}

export interface BatchSummaryData {
  total_batches: number;
  ongoing_batches: number;
  completed_batches: number;
  online_batches: number;
  offline_batches: number;
}

/**
 * Hook to fetch batch summary analytics.
 * @param params { date_from, date_to }
 */
export function useGetBatchSummary(params: GetBatchSummaryParams) {
  // Clean params - only include defined values
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== "")
  );

  return useQuery<BatchSummaryData>({
    queryKey: [queryKeys.batches, "summary", cleanParams],
    queryFn: async () => {
      const response = await api.get(API_ENDPOINTS.batches.GET_SUMMARY, {
        params: cleanParams,
      });

      return response.data.data;
    },
  });
}
