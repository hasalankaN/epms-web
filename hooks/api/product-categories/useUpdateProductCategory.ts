import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

export interface UpdateProductCategoryPayload {
  id: string;
  name: string;
}

export function useUpdateProductCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...payload }: UpdateProductCategoryPayload) => {
      const response = await api.patch(API_ENDPOINTS.productCategories.UPDATE(id), payload);

      return response.data;
    },
    onSuccess: () => {
      toast.success("Product category updated successfully");
      queryClient.invalidateQueries({ queryKey: [queryKeys.productCategories] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to update product category";

      toast.error(message);
    },
  });
}
