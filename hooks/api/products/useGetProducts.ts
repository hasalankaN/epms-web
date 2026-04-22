import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

export type ProductType = "DIGITAL" | "DELIVERY";
export type ProductStatus = "DRAFT" | "ACTIVE";
export type ProductStockStatus = "IN_STOCK" | "OUT_OF_STOCK" | "LOW_STOCK";
export type ProductSortBy = "RECENT" | "POPULAR" | "PRICE_ASC" | "PRICE_DESC";

export interface GetProductsParams {
  page?: number;
  size?: number;
  orderBy?: string;
  order?: "asc" | "desc";
  search?: string;
  type?: ProductType;
  status?: ProductStatus;
  stockStatus?: ProductStockStatus;
  sortBy?: ProductSortBy;
  category_id?: string;
}

export interface ProductResponseItem {
  id: string;
  name: string;
  sku: string;
  category_id: string | null;
  category_name: string | null;
  short_description: string;
  price: string;
  starting_stock: number | null;
  current_stock: number | null;
  stock_threshold: number | null;
  type: ProductType;
  status: ProductStatus;
  created_at: string;
  product_image_url: string | null;
  stock_status: ProductStockStatus;
}

export interface GetProductsResponse {
  results: ProductResponseItem[];
  totalResults: number;
  page: number;
  size: number;
  totalPages: number;
  isFirstPage: boolean;
  isLastPage: boolean;
}

export function useGetProducts(params: GetProductsParams) {
  // Clean params - only include defined values
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== "")
  );

  return useQuery<GetProductsResponse>({
    queryKey: [queryKeys.products, cleanParams],
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

      const response = await api.get(API_ENDPOINTS.products.GET_ALL, {
        params: apiParams,
      });
      
      return response.data.data;
    },
  });
}
