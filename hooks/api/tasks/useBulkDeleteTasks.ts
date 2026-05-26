import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

export function useBulkDeleteTasks() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      const response = await api.post(
        API_ENDPOINTS.tasks.DELETE_BULK,
        { ids }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.tasks] });
      toast.success("Selected tasks deleted successfully.");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to delete tasks."
      );
    },
  });
}
