import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";

export type BatchReportMetric =
  | "PAYMENTS"
  | "DISCOUNTS"
  | "REFERRAL_COMMISSIONS"
  | "EXPENSES"
  | "NET_PROFIT";

export type TimeGrouping = "DAYS" | "MONTHS";

export interface BatchWiseParams {
  branch_id?: string;
  batch_id?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
  page?: number;
  size?: number;
}

export interface BatchWiseSummary {
  total_payments: string;
  total_discounts: string;
  total_referral_commissions: string;
  total_expenses: string;
  net_profit: string;
}

// Payment table row
export interface BatchPaymentRow {
  batch_id: string;
  batch_name: string;
  branch: string;
  total_amount_to_collect: string;
  total_pending_payment: string;
  payment_status: string;
}

// Discount table row
export interface BatchDiscountRow {
  batch_name: string;
  batch_id: string;
  student_name: string;
  referral_name: string;
  actual_value: string;
  offer_value: string;
  discount_percentage: string;
  offered_on: string;
}

// Commission table row
export interface BatchCommissionRow {
  batch_id: string;
  batch_name: string;
  student_name: string;
  payment_amount: string;
  referral_commission: string;
  referral_name: string;
  agent_type: string;
  date: string;
  offered_by: string;
}

// Expense table row
export interface BatchExpenseRow {
  date: string;
  expense_description: string;
  batch_name: string;
  branch: string;
  amount: string;
  transaction_via: string;
}

// Net profit table row
export interface BatchNetProfitRow {
  batch_id: string;
  batch_name: string;
  branch: string;
  total_income: string;
  total_expenses: string;
  profit_loss_value: string;
  profit_loss_status: string;
}

export interface BatchWiseTableResponse<T> {
  results: T[];
  totalResults: number;
  page: number;
  size: number;
  totalPages: number;
}

export interface GraphPoint {
  date: string;
  value: string;
}

function cleanParams(params: Record<string, any>) {
  return Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== ""),
  );
}

export function useGetBatchWiseSummary(params: BatchWiseParams) {
  return useQuery<BatchWiseSummary>({
    queryKey: ["batch-wise", "summary", params],
    queryFn: async () => {
      const res = await api.get(API_ENDPOINTS.finances.BATCH_WISE_SUMMARY, {
        params: cleanParams(params as unknown as Record<string, unknown>),
      });

      return res.data.data as BatchWiseSummary;
    },
  });
}

export function useGetBatchWiseTable<T = unknown>(
  params: BatchWiseParams & { metric: BatchReportMetric },
) {
  return useQuery<BatchWiseTableResponse<T>>({
    queryKey: ["batch-wise", "table", params],
    queryFn: async () => {
      const res = await api.get(API_ENDPOINTS.finances.BATCH_WISE_TABLE, {
        params: cleanParams(params as unknown as Record<string, unknown>),
      });

      return res.data.data as BatchWiseTableResponse<T>;
    },
  });
}

export function useGetBatchWiseGraph(params: {
  metric: BatchReportMetric;
  time_grouping?: TimeGrouping;
  date_from?: string;
  date_to?: string;
  branch_id?: string;
  batch_id?: string;
}) {
  return useQuery<GraphPoint[]>({
    queryKey: ["batch-wise", "graph", params],
    queryFn: async () => {
      const res = await api.get(API_ENDPOINTS.finances.BATCH_WISE_GRAPH, {
        params: cleanParams(params as unknown as Record<string, unknown>),
      });
      
      return res.data.data as GraphPoint[];
    },
  });
}
