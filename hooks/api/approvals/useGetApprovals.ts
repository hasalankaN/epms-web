import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";
import type {
  ApprovalsApiBankTransferItem,
  ApprovalsApiRejectedItem,
  ApprovalsApiResponse,
} from "@/types/approval";

export type ApprovalTabType = "BATCH" | "COURSE" | "PRODUCT" | "REJECTED";

export interface GetApprovalsParams {
  type: ApprovalTabType;
  page?: number;
  size?: number;
  search?: string;
  dateRange?: { from?: Date; to?: Date };
}

export function useGetApprovals<
  T = ApprovalsApiBankTransferItem | ApprovalsApiRejectedItem,
>(params: GetApprovalsParams) {
  const { type, page = 1, size = 10, search, dateRange } = params;

  const queryParams: Record<string, any> = { type, page, size };

  if (search) queryParams.search = search;
  if (dateRange?.from)
    queryParams.date_start = format(dateRange.from, "yyyy-MM-dd'T'00:00:00");
  if (dateRange?.to)
    queryParams.date_end = format(dateRange.to, "yyyy-MM-dd'T'23:59:59");

  return useQuery<ApprovalsApiResponse<T>>({
    queryKey: [queryKeys.approvals, queryParams],
    queryFn: async () => {
      const { data } = await api.get(API_ENDPOINTS.approvals.GET_ALL, {
        params: queryParams,
      });

      
return data.data;
    },
  });
}
