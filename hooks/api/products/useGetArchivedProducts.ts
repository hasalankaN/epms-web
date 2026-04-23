import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";
import type { GetProductsParams, GetProductsResponse } from "./useGetProducts";

export function useGetArchivedProducts(params: GetProductsParams) {
  // Clean params - only include defined values
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== "")
  );

  return useQuery<GetProductsResponse>({
    queryKey: [queryKeys.products, "archived", cleanParams],
    queryFn: async () => {
      const apiParams: Record<string, any> = {
        page: params.page || 1,
        size: params.size || 20,
      };

      // Only add optional params if they have values
      if (params.orderBy) apiParams.orderBy = params.orderBy;
      if (params.order) apiParams.order = params.order;
      if (params.search) apiParams.search = params.search;
      if (params.type) apiParams.type = params.type;
      if (params.status) apiParams.status = params.status;
      if (params.stockStatus) apiParams.stockStatus = params.stockStatus;
      if (params.sortBy) apiParams.sortBy = params.sortBy;
      if (params.category_id) apiParams.category_id = params.category_id;

      const response = await api.get(API_ENDPOINTS.products.GET_ARCHIVED, {
        params: apiParams,
      });
      
      return response.data.data;
    },
  });
}
