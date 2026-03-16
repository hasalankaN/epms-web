import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

export interface UpdateCategoryStatusPayload {
  id: string;
  isActive: boolean;
}

export function useUpdateCategoryStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isActive }: UpdateCategoryStatusPayload) => {
      const response = await api.patch(API_ENDPOINTS.courseCategories.UPDATE_STATUS(id), { isActive });

      return response.data;
    },
    onSuccess: (_, variables) => {
      toast.success(`Category ${variables.isActive ? "activated" : "deactivated"} successfully`);
      queryClient.invalidateQueries({ queryKey: [queryKeys.courseCategories] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to update category status";

      toast.error(message);
    },
  });
}
