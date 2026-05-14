import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";
import type { ApiStudentRow } from "@/types/user-management";

export interface GetStudentsParams {
  page?: number;
  size?: number;
  orderBy?: string;
  order?: "asc" | "desc";
  search?: string;
  district?: string;
  enrollment_date_from?: string; // ISO8601 string
  enrollment_date_to?: string; // ISO8601 string
  payment_status?: string;
  certificate_status?: string;
  student_status?: string;
}

export interface GetStudentsResponse {
  results: ApiStudentRow[];
  totalResults: number;
  page: number;
  size: number;
  totalPages: number;
}

export function useGetStudents(params: GetStudentsParams) {
  // Clean params - only include defined values
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== "")
  );

  return useQuery<GetStudentsResponse>({
    queryKey: [queryKeys.students, cleanParams],
    queryFn: async () => {
      const apiParams: Record<string, any> = {
        page: params.page || 1,
        size: params.size || 10,
      };

      // Only add optional params if they have values
      if (params.orderBy) apiParams.orderBy = params.orderBy;
      if (params.order) apiParams.order = params.order;
      if (params.search) apiParams.search = params.search;
      if (params.district) apiParams.district = params.district;
      if (params.enrollment_date_from) apiParams.enrollment_date_from = params.enrollment_date_from;
      if (params.enrollment_date_to) apiParams.enrollment_date_to = params.enrollment_date_to;
      if (params.payment_status) apiParams.payment_status = params.payment_status;
      if (params.certificate_status) apiParams.certificate_status = params.certificate_status;
      if (params.student_status) apiParams.student_status = params.student_status;

      const response = await api.get(API_ENDPOINTS.adminStudents.GET_ALL, {
        params: apiParams,
      });
      
      const payload = response.data.data;
      
      return {
        results: payload.results || [],
        totalResults: payload.totalResults || 0,
        page: payload.page || 1,
        size: payload.size || 10,
        totalPages: payload.totalPages || 1,
      };
    },
  });
}
