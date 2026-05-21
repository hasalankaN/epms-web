import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";

// ===== LABEL MAPS =====

/** Maps raw backend payment_via values to display labels */
export const PAYMENT_VIA_LABELS: Record<string, string> = {
  BOC: "BOC",
  PEOPLES_BANK: "Peoples Bank",
  COMMERCIAL_BANK: "Commercial Bank",
  HNB: "HNB",
  ONLINE: "Online",
  CASH: "Cash",
};

/** Maps the filter chip keys (lowercase) to backend payment_via enum values */
export const FILTER_KEY_TO_VIA: Record<string, string> = {
  boc: "BOC",
  peoples: "PEOPLES_BANK",
  cash: "CASH",
  online: "ONLINE",
  commercial: "COMMERCIAL_BANK",
  hnb: "HNB",
};

// ===== TYPES =====

export interface SourceWiseSummaryItem {
  transaction_via: string;
  transaction_source: string;
  total_income: string;
  total_expense: string;
}

export interface SourceWiseSummaryMeta {
  total: number;
  page: number;
  size: number;
  totalPages: number;
}

export interface SourceWiseSummaryResponse {
  data: SourceWiseSummaryItem[];
  meta: SourceWiseSummaryMeta;
}

export interface TransactionDetailItem {
  transaction_date: string | null;
  transaction_type: "INCOME" | "EXPENSE";
  description: string;
  source_name: string;
  amount: string;
  payment_via?: string;
}

export interface TransactionDetailMeta {
  total: number;
  page: number;
  size: number;
  totalPages: number;
}

export interface TransactionDetailResponse {
  data: TransactionDetailItem[];
  meta: TransactionDetailMeta;
}

// ===== PARAMS =====

export interface SourceWiseSummaryParams {
  payment_via?: string[]; // e.g. ["BOC", "CASH"]
  date_from?: string;
  date_to?: string;
  page?: number;
  size?: number;
}

export interface TransactionDetailParams {
  date_from?: string;
  date_to?: string;
  page?: number;
  size?: number;
}

// ===== HOOKS =====

export function useGetSourceWiseSummary(params: SourceWiseSummaryParams) {
  return useQuery<SourceWiseSummaryResponse>({
    queryKey: ["finances", "source-wise", "summary", params],
    queryFn: async () => {
      const apiParams: Record<string, unknown> = {
        page: params.page ?? 1,
        size: params.size ?? 20,
      };

      if (params.date_from) apiParams.date_from = params.date_from;
      if (params.date_to) apiParams.date_to = params.date_to;

      // Send as comma-separated string; backend @Transform splits it back to array
      if (params.payment_via && params.payment_via.length > 0) {
        apiParams.payment_via = params.payment_via.join(",");
      }

      const response = await api.get(
        API_ENDPOINTS.finances.SOURCE_WISE_SUMMARY,
        {
          params: apiParams,
        },
      );

      return response.data.data;
    },
  });
}

export function useGetSourceWiseDetail(
  transaction_via: string | null,
  params: TransactionDetailParams,
  enabled = true,
) {
  return useQuery<TransactionDetailResponse>({
    queryKey: ["finances", "source-wise", "detail", transaction_via, params],
    queryFn: async () => {
      if (!transaction_via) throw new Error("No transaction_via provided");

      const apiParams: Record<string, unknown> = {
        page: params.page ?? 1,
        size: params.size ?? 100,
      };

      if (params.date_from) apiParams.date_from = params.date_from;
      if (params.date_to) apiParams.date_to = params.date_to;

      const response = await api.get(
        API_ENDPOINTS.finances.SOURCE_WISE_DETAIL(transaction_via),
        { params: apiParams },
      );

      return response.data.data;
    },
    enabled: enabled && !!transaction_via,
  });
}
