import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

export function useApproveCommission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const { data } = await api.patch(API_ENDPOINTS.commissions.APPROVE(id));

      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.commissions] });
      toast.success("Commission approved successfully.");
    },
    onError: () => {
      toast.error("Failed to approve commission. Please try again.");
    },
  });
}
