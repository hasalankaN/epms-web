import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

export interface UpdateProductImage {
  url: string;
  is_primary: boolean;
  display_order: number;
}

export interface UpdateProductPayload {
  name: string;
  type?: "DIGITAL" | "DELIVERY";
  sku?: string;
  short_description?: string;
  long_description?: string;
  price?: string;
  starting_stock?: number;
  stock_threshold?: number;
  commission_type?: "FIXED" | "PERCENTAGE";
  commission_value?: string;
  team_commission_value?: string;
  status: "ACTIVE" | "DRAFT";
  category_id?: string;
  images?: UpdateProductImage[];
}

export interface UpdateProductResponse {
  status: string;
  message: string | null;
  data: {
    id: string;
    name: string;
    type: "DIGITAL" | "DELIVERY";
    sku: string;
    short_description: string;
    long_description: string;
    price: string;
    starting_stock: number;
    current_stock: number | null;
    stock_threshold: number;
    commission_type: "FIXED" | "PERCENTAGE";
    commission_value: string;
    team_commission_value: string;
    status: "ACTIVE" | "DRAFT";
    is_archived: boolean;
    created_at: string;
    updated_at: string;
    created_by: string;
    updated_by: string;
    deleted_at: string | null;
    stock_status: string;
  };
}

export function useUpdateProduct(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateProductPayload) => {
      const response = await api.patch<UpdateProductResponse>(
        API_ENDPOINTS.products.UPDATE(id),
        payload
      );

      return response.data;
    },
    onSuccess: () => {
      toast.success("Product updated successfully.");
      queryClient.invalidateQueries({ queryKey: [queryKeys.products] });
    },
    onError: () => {
      toast.error("Failed to update product. Please try again.");
    },
  });
}
