import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";
import type { ApiEnquiryRow } from "@/types/inquiry";

export interface GetEnquiriesParams {
  page?: number;
  size?: number;
  orderBy?: string;
  order?: "asc" | "desc";
  search?: string;
  status?: string;
  source?: string;
  district?: string;
  branch_id?: string;
  assignee_user_id?: string;
  interest_id?: string;
  date_from?: string;
  date_to?: string;
  follow_up_from?: string;
  follow_up_to?: string;
  tab?: "assignment_pending" | "all";
  priority_status?: "HOT" | "COLD";
}

export interface GetEnquiriesResponse {
  data: ApiEnquiryRow[];
  meta: {
    total: number;
    page: number;
    size: number;
    total_pages: number;
  };
}

export function useGetEnquiries(params: GetEnquiriesParams) {
  // Clean params - only include defined, non-empty values
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== "")
  );

  return useQuery<GetEnquiriesResponse>({
    queryKey: [queryKeys.enquiries, cleanParams],
    queryFn: async () => {
      const apiParams: Record<string, any> = {
        page: params.page || 1,
        size: params.size || 20, // default is 20
        orderBy: params.orderBy || "createdAt",
        order: params.order || "desc",
        tab: params.tab || "all",
      };

      // Add optional params if they have values
      if (params.search) apiParams.search = params.search;
      if (params.status) apiParams.status = params.status;
      if (params.source) apiParams.source = params.source;
      if (params.district) apiParams.district = params.district;
      if (params.branch_id) apiParams.branch_id = params.branch_id;
      if (params.assignee_user_id) apiParams.assignee_user_id = params.assignee_user_id;
      if (params.interest_id) apiParams.interest_id = params.interest_id;
      if (params.date_from) apiParams.date_from = params.date_from;
      if (params.date_to) apiParams.date_to = params.date_to;
      if (params.follow_up_from) apiParams.follow_up_from = params.follow_up_from;
      if (params.follow_up_to) apiParams.follow_up_to = params.follow_up_to;
      if (params.priority_status) apiParams.priority_status = params.priority_status;

      const response = await api.get(API_ENDPOINTS.enquiries.GET_ALL, {
        params: apiParams,
      });

      return response.data.data;
    },
  });
}
