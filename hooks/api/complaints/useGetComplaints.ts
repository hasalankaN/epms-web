import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";
import type { ComplaintDataType, ComplaintStatus, ComplaintType } from "@/types/complaint";

export interface GetComplaintsParams {
  page?: number;
  size?: number;
  orderBy?: string;
  order?: "asc" | "desc";
  search?: string;
  type?: ComplaintType;
  status?: ComplaintStatus;
  assignee?: string;
  date_start?: string;
  date_end?: string;
}

export interface GetComplaintsResponse {
  data: ComplaintDataType[];
  meta: {
    total: number;
    page: number;
    size: number;
    last_page: number;
  };
}

export function useGetComplaints(params: GetComplaintsParams) {
  // Clean params - only include defined values
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== "")
  );

  return useQuery<GetComplaintsResponse>({
    queryKey: [queryKeys.complaints, cleanParams],
    queryFn: async () => {
      const apiParams: Record<string, any> = {
        page: params.page || 1,
        size: params.size || 10,
        orderBy: params.orderBy || "createdAt",
        order: params.order || "desc",
      };

      if (params.search) apiParams.search = params.search;
      if (params.type) apiParams.type = params.type;
      if (params.status) apiParams.status = params.status;
      if (params.assignee) apiParams.assignee = params.assignee;
      if (params.date_start) apiParams.date_start = params.date_start;
      if (params.date_end) apiParams.date_end = params.date_end;

      const response = await api.get(API_ENDPOINTS.complaints.GET_ALL, {
        params: apiParams,
      });

      return response.data.data;
    },
  });
}
