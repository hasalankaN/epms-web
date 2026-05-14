import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";
import type { BatchStatus } from "@/types/batch";

export interface UpdateBatchStatusPayload {
  status: BatchStatus;
}

/**
 * Hook to update only the status of a specific batch.
 * @param id Batch ID
 */
export function useUpdateBatchStatus(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateBatchStatusPayload) => {
      const { data } = await api.patch(API_ENDPOINTS.batches.UPDATE_STATUS(id), payload);

      return data;
    },
    onSuccess: () => {
      // Invalidate the batches list, specific batch details, and summary stats
      queryClient.invalidateQueries({ queryKey: [queryKeys.batches] });
      toast.success("Batch status updated successfully.");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update batch status.");
    },
  });
}
