import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

// ==================== API Response Types ====================

export interface ApiBatchHierarchy {
  batch_id: string;
  tier_count: number;
  level_1_name: string;
  level_2_name: string | null;
  level_3_name: string | null;
  level_4_name: string | null;
  level_5_name: string | null;
  created_by: string;
  updated_by: string;
}

export interface ApiBatchFeeItem {
  id: string;
  batch_id: string;
  label: string;
  amount: string;
  created_by: string;
  updated_by: string;
}

export interface ApiBatchInstallment {
  batch_id: string;
  installment_count: number;
  created_by: string;
  updated_by: string;
}

export interface ApiBatchExtendedAccessOption {
  id: string;
  batch_id: string;
  years: number;
  price: string;
  created_by: string;
  updated_by: string;
}

export interface ApiBatchCommissionRule {
  id: string;
  batch_id: string;
  commission_target: "REFERRAL" | "LECTURER" | "STAFF";
  commission_scope: "DIRECT" | "TEAM" | "PER_ENROLLMENT" | "PER_BRANCH";
  calculation_type: "PERCENTAGE" | "FIXED";
  value: string;
  branch_id: string | null;
  created_at: string;
  created_by: string;
  updated_by: string;
}

export interface ApiBatchCommission {
  batch_id: string;
  is_customized: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  rules: ApiBatchCommissionRule[];
}

export interface ApiBatchDetail {
  id: string;
  name: string;
  category: string;
  type: string;
  status: string;
  branch_id: string;
  start_date: string;
  end_date: string;
  is_draft: boolean;
  tier_count: number;
  language: string;
  lesson_duration: string;
  description: string | null;
  cover_image_url: string | null;
  created_at: string;
  updated_at: string;
  lecturer_id: string | null;
  lecturer_email: string | null;
  level: string | null;
  staff_ids: string[];
  certificate_ids: string[];
  has_assignment: boolean;
  hierarchy: ApiBatchHierarchy | null;
  fee_items: ApiBatchFeeItem[];
  installment: ApiBatchInstallment | null;
  extended_access_options: ApiBatchExtendedAccessOption[];
  commission: ApiBatchCommission | null;
}

interface ApiBatchDetailResponse {
  status: string;
  message: string | null;
  data: ApiBatchDetail;
}

// ==================== Hook ====================

export function useGetBatchById(id: string | null) {
  return useQuery({
    queryKey: [queryKeys.batches, id],
    queryFn: async () => {
      if (!id) return null;

      const response = await api.get<ApiBatchDetailResponse>(
        API_ENDPOINTS.batches.GET_BY_ID(id)
      );

      return response.data.data;
    },
    enabled: !!id,
  });
}
