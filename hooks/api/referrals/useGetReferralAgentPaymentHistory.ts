import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";
import type { PaymentHistoryGroup } from "@/components/admin-panel/referral-management/referral-listing/modals/PaymentHistoryModal";
import type { CommonResponseDataType } from "@/types/common";

export function useGetReferralAgentPaymentHistory(agentId: string | null) {
  return useQuery({
    queryKey: [queryKeys.referralAgentPaymentHistory, agentId],
    queryFn: async () => {
      if (!agentId) return null;
      const { data } = await api.get<CommonResponseDataType<PaymentHistoryGroup[]>>(
        API_ENDPOINTS.referrals.GET_PAYMENT_HISTORY(agentId)
      );
      return data.data;
    },
    enabled: !!agentId,
  });
}
