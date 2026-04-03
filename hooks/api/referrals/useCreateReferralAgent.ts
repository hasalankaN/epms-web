import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

export interface CreateReferralAgentPayload {
  first_name: string;
  last_name: string;
  email: string;
  gender: string; // "MALE" | "FEMALE"
  phone: string;  
  whatsapp: string;
  district: string;
  role: string;   // "LEADER" | "MEMBER"
}

export function useCreateReferralAgent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateReferralAgentPayload) => {
      const response = await api.post(API_ENDPOINTS.referrals.CREATE, payload);
      
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.referrals] });
      toast.success("Referral agent created successfully.");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create referral agent.");
    },
  });
}
