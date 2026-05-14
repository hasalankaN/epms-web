import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

// ==================== Types ====================

export interface BatchEnrollmentStats {
  total: number;
  direct: number;
  referral: number;
}

export interface BatchCertificateStats {
  completed_payments: number;
  issued_certificates: number;
  total_downloads: number;
  pending_certificates: number;
}

export interface BatchPayOutItem {
  label: string;
  amount: string;
}

export interface BatchFinancialSummary {
  total_payments: string;
  referral_commissions: string;
  discounts: string;
  pay_outs: BatchPayOutItem[];
  total_profit: string;
  estimated_payment: string;
  pending_payment: string;
  completed_percentage: number;
}

export interface BatchAnalytics {
  enrollment_stats: BatchEnrollmentStats;
  certificate_stats: BatchCertificateStats;
  financial_summary: BatchFinancialSummary;
}

interface ApiBatchAnalyticsResponse {
  status: string;
  message: string | null;
  data: BatchAnalytics;
}

// ==================== Hook ====================

export function useGetBatchAnalytics(batchId: string | null) {
  return useQuery({
    queryKey: [queryKeys.batchAnalytics, batchId],
    queryFn: async () => {
      if (!batchId) return null;

      const response = await api.get<ApiBatchAnalyticsResponse>(
        API_ENDPOINTS.batches.GET_ANALYTICS(batchId),
      );

      return response.data.data;
    },
    enabled: !!batchId,
  });
}
