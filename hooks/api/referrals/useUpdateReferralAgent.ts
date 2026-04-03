import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";
import type { UpdateReferralAgentPayload } from "@/types/referral";

export function useUpdateReferralAgent(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateReferralAgentPayload) => {
      const response = await api.patch(API_ENDPOINTS.referrals.UPDATE(id), payload);
      
      return response.data;
    },
    onSuccess: () => {
      toast.success("Referral agent updated successfully.");
      queryClient.invalidateQueries({ queryKey: [queryKeys.referrals] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update referral agent.");
    },
  });
}
