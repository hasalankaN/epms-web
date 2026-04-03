import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

export interface UpdateReferralAgentStatusPayload {
  status: "ACTIVE" | "INACTIVE";
}

export function useUpdateReferralAgentStatus(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateReferralAgentStatusPayload) => {
      const { data } = await api.patch(
        API_ENDPOINTS.referrals.UPDATE_STATUS(id),
        payload
      );

      return data;
    },
    onSuccess: () => {
      toast.success("Referral agent status updated successfully.");
      queryClient.invalidateQueries({ queryKey: [queryKeys.referrals] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to update referral agent status."
      );
    },
  });
}
