import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

// ==================== Payload Types (match API contract exactly) ====================

interface BaseFeeDto {
  amount: number;
  description: string;
}

interface InstallmentPlanDto {
  description: string;
  amount: number;
}

interface AdditionalFeeDto {
  amount: number;
  duration_years: number;
  description: string;
}

interface CommissionEntryDto {
  type: "Percentage" | "Fixed";
  value: number;
  team_value?: number;
}

export interface UpdateBatchPayload {
  general_details: {
    name: string;
    category: string;
    batch_type: string;
    level?: string;
    language: string;
    branch_id: string;
    lecturer_id: string;
    start_date: string;
    end_date: string;
    has_assignment: boolean;
    lesson_duration_hours?: number;
    description?: string;
    cover_image_url?: string;
    status: string;
    hierarchy_type: string;
    staff_member_ids: string[];
    certificate_ids: string[];
  };
  fee_details: {
    pricing_option: "Paid" | "Free";
    base_fees?: BaseFeeDto[];
    installments_enabled?: boolean;
    number_of_installments?: number;
    installment_plans?: InstallmentPlanDto[];
    additional_fees?: AdditionalFeeDto[];
  };
  commission_details: {
    referral: CommissionEntryDto;
    lecturer: CommissionEntryDto;
    staff: CommissionEntryDto;
    branch_staff: CommissionEntryDto;
  };
}

export function useUpdateBatch(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateBatchPayload) => {
      const { data } = await api.patch(API_ENDPOINTS.batches.UPDATE(id), payload);

      return data?.data;
    },
    onSuccess: () => {
      // Invalidate list + remove this specific batch's detail cache to avoid stale values in RHF next time
      queryClient.invalidateQueries({ queryKey: [queryKeys.batches] });
      queryClient.removeQueries({ queryKey: [queryKeys.batches, id], exact: true });
      toast.success("Batch updated successfully.");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update batch.");
    },
  });
}
