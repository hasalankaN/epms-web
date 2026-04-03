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
  team_value: number;
}

export interface CreateBatchPayload {
  general_details: {
    name: string;
    branch_id: string;
    language: string;
    batch_type: string;
    staff_member_ids: string[];
    has_assignment: boolean;
    category: string;
    start_date: string;
    end_date: string;
    certificate_ids: string[];
    status: string;
    lecturer_id: string;
    level: string;
    hierarchy_type: string;
    lesson_duration_hours?: number;
    description?: string;
    cover_image_url?: string;
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

export interface CreateBatchResponse {
  id: string;
  batch_id: string;
}

export function useCreateBatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateBatchPayload): Promise<CreateBatchResponse> => {
      const response = await api.post(API_ENDPOINTS.batches.CREATE, payload);

      return response.data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.batches] });
      toast.success("Batch created successfully.");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create batch.");
    },
  });
}
