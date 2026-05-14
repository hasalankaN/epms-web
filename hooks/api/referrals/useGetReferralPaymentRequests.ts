import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";
import type {
  GetPaymentRequestsParams,
  GetPaymentRequestsResponse,
  PaymentRequestStatus,
} from "@/types/referral";

export function useGetReferralPaymentRequests(
  status: PaymentRequestStatus,
  params: GetPaymentRequestsParams,
) {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(
      ([, v]) => v !== undefined && v !== null && v !== "",
    ),
  );

  const endpoint =
    status === "PENDING"
      ? API_ENDPOINTS.referrals.GET_PAYMENT_REQUESTS_PENDING
      : API_ENDPOINTS.referrals.GET_PAYMENT_REQUESTS_COMPLETED;

  return useQuery<GetPaymentRequestsResponse>({
    queryKey: [queryKeys.referralPaymentRequests, status, cleanParams],
    queryFn: async () => {
      const response = await api.get(endpoint, { params: cleanParams });

      return response.data.data;
    },
  });
}
