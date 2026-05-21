import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";

export interface CreateOtherIncomePayload {
  transaction_date?: string;
  description: string;
  amount: string;
  transaction_via: string;
  branch_id: string;
  evidence_url?: string;
}

export function useCreateOtherIncome() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateOtherIncomePayload) =>
      api.post(API_ENDPOINTS.finances.OTHER_INCOME_CREATE, payload),
    onSuccess: () => {
      toast.success("Income recorded successfully.");
      queryClient.invalidateQueries({ queryKey: ["finances", "other-income"] });
    },
    onError: () => {
      toast.error("Failed to record income.");
    },
  });
}
