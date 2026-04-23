import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

export interface CreateProductCategoryPayload {
  name: string;
}

export function useCreateProductCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateProductCategoryPayload) => {
      const response = await api.post(API_ENDPOINTS.productCategories.CREATE, payload);

      return response.data;
    },
    onSuccess: () => {
      toast.success("Product category created successfully");
      queryClient.invalidateQueries({ queryKey: [queryKeys.productCategories] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to create product category";

      toast.error(message);
    },
  });
}
