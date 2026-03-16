import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";
import type { ApiStaffRow, MemberStatus } from "@/types/user-management";

export interface GetStaffParams {
  page?: number;
  size?: number;
  orderBy?: string;
  order?: "asc" | "desc";
  search?: string;
  branch_id?: string;
  is_branch_manager?: boolean;
  salary_type?: string;
  salaryStatus?: string;
  status?: MemberStatus;
  role?: "MEMBER" | "MANAGER";
  regDateFrom?: string;
  regDateTo?: string;
}

export interface GetStaffResponse {
  results: ApiStaffRow[];
  totalResults: number;
  page: number;
  size: number;
  totalPages: number;
  isFirstPage: boolean;
  isLastPage: boolean;
}

export function useGetStaff(params: GetStaffParams) {
  // Clean params - only include defined values
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== "")
  );

  return useQuery<GetStaffResponse>({
    queryKey: [queryKeys.staff, cleanParams],
    queryFn: async () => {
      const apiParams: Record<string, any> = {
        page: params.page || 1,
        size: params.size || 10,
        orderBy: params.orderBy || "createdAt",
        order: params.order || "desc",
      };

      // Add optional params
      if (params.search) apiParams.search = params.search;
      if (params.branch_id) apiParams.branch_id = params.branch_id;
      if (params.is_branch_manager !== undefined) apiParams.is_branch_manager = params.is_branch_manager;
      if (params.salary_type) apiParams.salary_type = params.salary_type;
      if (params.salaryStatus) apiParams.salaryStatus = params.salaryStatus;
      if (params.status) apiParams.status = params.status;
      if (params.role) apiParams.role = params.role;
      if (params.regDateFrom) apiParams.regDateFrom = params.regDateFrom;
      if (params.regDateTo) apiParams.regDateTo = params.regDateTo;

      const response = await api.get(API_ENDPOINTS.staff.GET_ALL, {
        params: apiParams,
      });
      
      return response.data.data;
    },
  });
}
