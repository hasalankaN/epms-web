import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

export interface ProductImage {
  url: string;
  is_primary: boolean;
  display_order: number;
}

export interface CreateProductPayload {
  name: string;
  type: "DIGITAL" | "DELIVERY";
  sku?: string;
  short_description?: string;
  long_description?: string;
  price: string;
  starting_stock?: number;
  stock_threshold?: number;
  commission_type?: "PERCENTAGE" | "FIXED";
  commission_value?: string;
  team_commission_value?: string;
  status: "ACTIVE" | "DRAFT";
  category_id: string;
  images?: ProductImage[];
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateProductPayload) => {
      const response = await api.post(API_ENDPOINTS.products.CREATE, payload);

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.products] });
      toast.success("Product created successfully.");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create product.");
    },
  });
}
