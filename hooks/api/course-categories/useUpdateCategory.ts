import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

export interface UpdateCategoryPayload {
  id: string;
  name: string;
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...payload }: UpdateCategoryPayload) => {
      const response = await api.patch(API_ENDPOINTS.courseCategories.UPDATE(id), payload);

      return response.data;
    },
    onSuccess: () => {
      toast.success("Category updated successfully");
      queryClient.invalidateQueries({ queryKey: [queryKeys.courseCategories] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to update category";

      toast.error(message);
    },
  });
}
