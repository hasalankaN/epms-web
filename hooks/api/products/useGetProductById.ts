import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";
import type { ProductType, ProductStatus, ProductStockStatus } from "./useGetProducts";

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  is_primary: boolean;
  display_order: number;
  created_at: string;
}

export interface ProductDetailItem {
  id: string;
  name: string;
  type: ProductType;
  sku: string;
  category_id: string;
  category_name: string | null;
  short_description: string;
  long_description: string;
  price: string;
  starting_stock: number;
  current_stock: number;
  stock_threshold: number;
  commission_type: "FIXED" | "PERCENTAGE";
  commission_value: string;
  team_commission_value: string;
  status: ProductStatus;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
  product_image_url: string | null;
  stock_status: ProductStockStatus;
  images: ProductImage[];
}

export interface ProductDetailResponse {
  status: string;
  message: string | null;
  data: ProductDetailItem;
}

export function useGetProductById(id: string | null) {
  return useQuery({
    queryKey: [queryKeys.products, id],
    queryFn: async () => {
      if (!id) return null;

      const response = await api.get<ProductDetailResponse>(
        API_ENDPOINTS.products.GET_BY_ID(id)
      );
      
      return response.data.data;
    },
    enabled: !!id,
  });
}
