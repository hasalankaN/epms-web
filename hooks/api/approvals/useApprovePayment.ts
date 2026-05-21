import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

export function useApprovePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      source,
      paymentId,
    }: {
      source: string;
      paymentId: string;
    }) => {
      const { data } = await api.patch(
        API_ENDPOINTS.approvals.APPROVE(source, paymentId),
      );

      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.approvals] });
      toast.success("Payment approved successfully.");
    },
    onError: () => {
      toast.error("Failed to approve payment. Please try again.");
    },
  });
}
