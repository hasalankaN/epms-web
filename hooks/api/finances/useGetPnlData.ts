import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";

export type PnlSource = "BATCH" | "COURSE" | "PRODUCT";
export type PnlStatus = "PROFIT" | "LOSS";

export interface PnlParams {
  source?: PnlSource;
  date_from?: string;
  date_to?: string;
  status?: PnlStatus;
  page?: number;
  size?: number;
}

export interface PnlSummary {
  total_income: string;
  total_expenses: string;
  net_pnl: string;
  status: PnlStatus;
}

export interface PnlEntity {
  source_type: PnlSource;
  source_id: string;
  source_name: string;
  total_income: string;
  total_expenses: string;
  profit_loss: string;
  status: PnlStatus;
}

export interface PnlListResponse {
  data: PnlEntity[];
  meta: { page: number; size: number; total: number };
}

export interface PnlIncomeRow {
  date: string;
  description: string;
  payment_via: string | null;
  amount: string;
  payment_type: string | null;
  payment_type_label: string | null;
}

export interface PnlExpenseRow {
  date: string;
  description: string;
  transaction_via: string | null;
  amount: string;
  category: string | null;
}

export interface PnlDetail {
  source_type: PnlSource;
  source_id: string;
  income: { rows: PnlIncomeRow[]; total: string };
  expenses: { rows: PnlExpenseRow[]; total: string };
  profit_loss: string;
  status: PnlStatus;
}

function cleanParams(params: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== ""),
  );
}

export function useGetPnlSummary(params: PnlParams) {
  return useQuery<PnlSummary>({
    queryKey: ["finances", "pnl-summary", params],
    queryFn: async () => {
      const res = await api.get(API_ENDPOINTS.finances.PNL_SUMMARY, { params: cleanParams(params as Record<string, unknown>) });

      return res.data.data as PnlSummary;
    },
  });
}

export function useGetPnlList(params: PnlParams) {
  return useQuery<PnlListResponse>({
    queryKey: ["finances", "pnl-list", params],
    queryFn: async () => {
      const res = await api.get(API_ENDPOINTS.finances.PNL_LIST, { params: cleanParams(params as Record<string, unknown>) });

      return res.data.data as PnlListResponse;
    },
  });
}

export function useGetPnlDetail(sourceType: string, sourceId: string, enabled: boolean) {
  return useQuery<PnlDetail>({
    queryKey: ["finances", "pnl-detail", sourceType, sourceId],
    queryFn: async () => {
      const res = await api.get(API_ENDPOINTS.finances.PNL_DETAIL(sourceType, sourceId));
      
      return res.data.data as PnlDetail;
    },
    enabled,
  });
}
