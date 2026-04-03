import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

/**
 * Hook to deactivate a batch (soft-delete).
 */
export function useDeactivateBatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.patch(API_ENDPOINTS.batches.DEACTIVATE(id));

      return data;
    },
    onSuccess: () => {
      // Invalidate the batches list, details, and summary stats
      queryClient.invalidateQueries({ queryKey: [queryKeys.batches] });
      toast.success("Batch deactivated successfully.");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to deactivate batch.");
    },
  });
}
