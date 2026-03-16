import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

export interface CreateCategoryPayload {
  name: string;
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateCategoryPayload) => {
      const response = await api.post(API_ENDPOINTS.courseCategories.CREATE, payload);

      return response.data;
    },
    onSuccess: () => {
      toast.success("Category created successfully");
      queryClient.invalidateQueries({ queryKey: [queryKeys.courseCategories] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to create category";

      toast.error(message);
    },
  });
}
