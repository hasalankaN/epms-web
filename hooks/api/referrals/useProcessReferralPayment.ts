import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";
import type { ProcessPaymentPayload } from "@/types/referral";

export function useProcessReferralPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      requestId,
      payload,
    }: {
      requestId: string;
      payload: ProcessPaymentPayload;
    }) => {
      const response = await api.post(
        API_ENDPOINTS.referrals.PROCESS_PAYMENT(requestId),
        payload,
      );

      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.referralPaymentRequests],
      });
    },
  });
}
