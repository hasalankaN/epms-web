import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

export interface CreateTaskPayload {
  name: string;
  description: string;
  due_date: string;
  type: "BATCH" | "STAFF";
  batch_ids?: string[];
  staff_user_ids?: string[];
  material_urls?: string[];
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateTaskPayload) => {
      const response = await api.post(API_ENDPOINTS.tasks.CREATE, payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.tasks] });
      toast.success("Task created successfully.");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to create task."
      );
    },
  });
}
