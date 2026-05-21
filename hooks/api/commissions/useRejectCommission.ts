import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

export function useRejectCommission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason?: string }) => {
      const { data } = await api.patch(API_ENDPOINTS.commissions.REJECT(id), {
        reason,
      });

      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.commissions] });
      toast.success("Commission rejected successfully.");
    },
    onError: () => {
      toast.error("Failed to reject commission. Please try again.");
    },
  });
}
