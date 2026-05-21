import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";
import type { CommissionsApiResponse } from "@/types/approval";

export type CommissionTabType = "BATCH" | "COURSE" | "PRODUCT" | "REJECTED";

export interface GetCommissionsParams {
  type: CommissionTabType;
  page?: number;
  size?: number;
  dateRange?: { from?: Date; to?: Date };
}

export function useGetCommissions(params: GetCommissionsParams) {
  const { type, page = 1, size = 10, dateRange } = params;

  const queryParams: Record<string, any> = { type, page, size };

  if (dateRange?.from)
    queryParams.date_start = format(dateRange.from, "yyyy-MM-dd'T'00:00:00");
  if (dateRange?.to)
    queryParams.date_end = format(dateRange.to, "yyyy-MM-dd'T'23:59:59");

  return useQuery<CommissionsApiResponse>({
    queryKey: [queryKeys.commissions, queryParams],
    queryFn: async () => {
      const { data } = await api.get(API_ENDPOINTS.commissions.GET_ALL, {
        params: queryParams,
      });

      return data.data as CommissionsApiResponse;
    },
  });
}
