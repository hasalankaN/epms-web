import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";
import type { ApiLecturerRow } from "@/types/user-management";

export interface GetLecturersParams {
  page?: number;
  size?: number;
  orderBy?: string;
  order?: "asc" | "desc";
  search?: string;
  status?: string;
  branch_id?: string;
  salary_type?: string;
  from?: string; // ISO8601 string
  to?: string; // ISO8601 string
  salary_payment_status?: string;
}

export interface GetLecturersResponse {
  results: ApiLecturerRow[];
  totalResults: number;
  page: number;
  size: number;
  totalPages: number;
  isFirstPage: boolean;
  isLastPage: boolean;
}

export function useGetLecturers(params: GetLecturersParams) {
  // Clean params - only include defined values
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== "")
  );

  return useQuery<GetLecturersResponse>({
    queryKey: [queryKeys.lecturers, cleanParams],
    queryFn: async () => {
      const apiParams: Record<string, any> = {
        page: params.page || 1,
        size: params.size || 10,
      };

      // Only add optional params if they have values
      if (params.orderBy) apiParams.orderBy = params.orderBy;
      if (params.order) apiParams.order = params.order;
      if (params.search) apiParams.search = params.search;
      if (params.status) apiParams.status = params.status;
      if (params.branch_id) apiParams.branch_id = params.branch_id;
      if (params.salary_type) apiParams.salary_type = params.salary_type;
      if (params.from) apiParams.from = params.from;
      if (params.to) apiParams.to = params.to;
      if (params.salary_payment_status) apiParams.salary_payment_status = params.salary_payment_status;

      const response = await api.get(API_ENDPOINTS.lecturers.GET_ALL, {
        params: apiParams,
      });
      
      return response.data.data;
    },
  });
}
