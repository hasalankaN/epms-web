import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

export interface GetCategoriesParams {
  page?: number;
  size?: number;
  orderBy?: string;
  order?: "asc" | "desc";
  search?: string;
}

export interface CategoryResponseItem {
  id: string;
  name: string;
  is_active: boolean;
  is_system: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
  deleted_at: string | null;
  ongoingCourses?: number; // Added based on ui requirements, if backend provides it
}

export interface GetCategoriesResponse {
  results: CategoryResponseItem[];
  totalResults: number;
  page: number;
  size: number;
  totalPages: number;
  isFirstPage: boolean;
  isLastPage: boolean;
}

export function useGetCategories(params: GetCategoriesParams) {
  // Clean params - only include defined values
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== "")
  );

  return useQuery<GetCategoriesResponse>({
    queryKey: [queryKeys.courseCategories, cleanParams],
    queryFn: async () => {
      const apiParams: Record<string, any> = {
        page: params.page || 1,
        size: params.size || 10,
      };

      // Only add optional params if they have values
      if (params.orderBy) apiParams.orderBy = params.orderBy;
      if (params.order) apiParams.order = params.order;
      if (params.search) apiParams.search = params.search;

      const response = await api.get(API_ENDPOINTS.courseCategories.GET_ALL, {
        params: apiParams,
      });
      
      return response.data.data;
    },
  });
}
