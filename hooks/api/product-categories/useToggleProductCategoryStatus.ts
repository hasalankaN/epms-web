import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

export interface ToggleProductCategoryStatusPayload {
  id: string;
  currentIsActive: boolean; // used for success message only
}

export function useToggleProductCategoryStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: ToggleProductCategoryStatusPayload) => {
      const response = await api.patch(API_ENDPOINTS.productCategories.TOGGLE_STATUS(id));

      return response.data;
    },
    onSuccess: (_, variables) => {
      const action = variables.currentIsActive ? "deactivated" : "activated";

      toast.success(`Product category ${action} successfully`);
      queryClient.invalidateQueries({ queryKey: [queryKeys.productCategories] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to update product category status";

      toast.error(message);
    },
  });
}
