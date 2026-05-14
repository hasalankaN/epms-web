import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

export interface RecordSalaryPaymentPayload {
  description: string;
  source_type: "MONTHLY" | "COURSE" | "BATCH";
  source_id?: string;
  amount: number;
  period?: string;
  paid_date?: string;
  receipt_url?: string;
}

export function useRecordLecturerSalaryPayment(lecturerId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RecordSalaryPaymentPayload) =>
      api.post(API_ENDPOINTS.lecturers.RECORD_SALARY_PAYMENT(lecturerId), payload),
    onSuccess: () => {
      toast.success("Payment recorded successfully.");
      queryClient.invalidateQueries({ queryKey: [queryKeys.lecturers, lecturerId] });
    },
    onError: () => {
      toast.error("Failed to record payment.");
    },
  });
}
