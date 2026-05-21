import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";

export type OverviewPeriodDays = 7 | 30 | 90;
export type OverviewGroupBy = "DAY" | "MONTH";

export interface OverviewParams {
  date_from?: string;
  date_to?: string;
  group_by?: OverviewGroupBy;
  metric?: "payments" | "discounts" | "referral_commissions" | "expenses" | "net_profit";
}

export interface OverviewSummary {
  total_payments: string | null;
  total_discounts: string | null;
  total_referral_commissions: string | null;
  total_expenses: string | null;
  net_profit: string | null;
}

export interface GraphSeries {
  period: string;
  total: string;
}

export interface OverviewGraph {
  chart_type: string;
  group_by: string;
  metric: string;
  series: GraphSeries[];
}

export interface TableRow {
  date: string;
  total_payments: string | null;
  total_discounts: string | null;
  total_commissions: string | null;
  total_expenses: string | null;
  net_profit: string | null;
}

function cleanParams(params: Record<string, any>) {
  return Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== ""),
  );
}

export function useGetFinanceOverviewSummary(params: OverviewParams) {
  return useQuery<OverviewSummary>({
    queryKey: ["finances", "overview-summary", params],
    queryFn: async () => {
      const res = await api.get(API_ENDPOINTS.finances.OVERVIEW_SUMMARY, { params: cleanParams(params) });

      return res.data.data as OverviewSummary;
    },
  });
}

export function useGetFinanceOverviewGraph(params: OverviewParams) {
  return useQuery<OverviewGraph>({
    queryKey: ["finances", "overview-graph", params],
    queryFn: async () => {
      const res = await api.get(API_ENDPOINTS.finances.OVERVIEW_GRAPH, { params: cleanParams(params) });

      return res.data.data as OverviewGraph;
    },
  });
}

export function useGetFinanceOverviewTable(params: OverviewParams) {
  return useQuery<TableRow[]>({
    queryKey: ["finances", "overview-table", params],
    queryFn: async () => {
      const res = await api.get(API_ENDPOINTS.finances.OVERVIEW_TABLE, { params: cleanParams(params) });
      
      return res.data.data as TableRow[];
    },
  });
}
