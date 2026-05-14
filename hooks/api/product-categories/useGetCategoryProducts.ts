import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

export interface CategoryProductItem {
  id: string;
  name: string;
  type: "DIGITAL" | "DELIVERY";
  status: "ACTIVE" | "INACTIVE";
  price: string;
  sku: string;
}

export interface GetCategoryProductsParams {
  id: string;
  page?: number;
  size?: number;
  orderBy?: string;
  order?: "asc" | "desc";
  search?: string;
}

export interface GetCategoryProductsResponse {
  results: CategoryProductItem[];
  totalResults: number;
  page: number;
  size: number;
  totalPages: number;
  isFirstPage: boolean;
  isLastPage: boolean;
}

export function useGetCategoryProducts(params: GetCategoryProductsParams) {
  return useQuery<GetCategoryProductsResponse>({
    queryKey: [queryKeys.productCategories, "products", params.id, params],
    queryFn: async () => {
      const apiParams: Record<string, any> = {
        page: params.page || 1,
        size: params.size || 20,
        orderBy: params.orderBy || "createdAt",
        order: params.order || "desc",
      };

      if (params.search) apiParams.search = params.search;

      const response = await api.get(API_ENDPOINTS.productCategories.GET_PRODUCTS(params.id), {
        params: apiParams,
      });

      return response.data.data;
    },
    enabled: !!params.id,
  });
}
