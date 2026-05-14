import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

export interface GetProductCategoriesParams {
  page?: number;
  size?: number;
  orderBy?: string;
  order?: "asc" | "desc";
  search?: string;
}

export interface ProductCategoryResponseItem {
  id: string;
  name: string;
  is_active: boolean;
  created_at: string;
  product_count: string;
}

export interface GetProductCategoriesResponse {
  results: ProductCategoryResponseItem[];
  totalResults: number;
  page: number;
  size: number;
  totalPages: number;
  isFirstPage: boolean;
  isLastPage: boolean;
}

export function useGetProductCategories(params: GetProductCategoriesParams) {
  // Clean params - only include defined values
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== "")
  );

  return useQuery<GetProductCategoriesResponse>({
    queryKey: [queryKeys.productCategories, cleanParams],
    queryFn: async () => {
      const apiParams: Record<string, any> = {
        page: params.page || 1,
        size: params.size || 10,
      };

      if (params.orderBy) apiParams.orderBy = params.orderBy;
      if (params.order) apiParams.order = params.order;
      if (params.search) apiParams.search = params.search;

      const response = await api.get(API_ENDPOINTS.productCategories.GET_ALL, {
        params: apiParams,
      });

      return response.data.data;
    },
  });
}
