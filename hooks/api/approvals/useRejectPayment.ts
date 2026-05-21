import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

export function useRejectPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      source,
      paymentId,
      reason,
    }: {
      source: string;
      paymentId: string;
      reason: string;
    }) => {
      const { data } = await api.patch(
        API_ENDPOINTS.approvals.REJECT(source, paymentId),
        { reason },
      );

      
return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.approvals] });
      toast.success("Payment rejected successfully.");
    },
    onError: () => {
      toast.error("Failed to reject payment. Please try again.");
    },
  });
}
