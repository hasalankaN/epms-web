import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";

export interface ProductWiseParams {
  product_id?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
  page?: number;
  size?: number;
}

export interface ProductWiseSummary {
  total_payments: string;
  total_discounts: string;
  total_referral_commissions: string;
  total_expenses: string;
  net_profit: string;
}

export interface ProductTableRow {
  date: string;
  product_name: string;
  total_payments: string;
  total_discounts: string;
  total_commissions: string;
  total_expenses: string;
  net_income: string;
}

export interface ProductTableResponse {
  data: ProductTableRow[];
  pagination: {
    page: number;
    size: number;
    total: number;
    total_pages: number;
  };
}

export interface ProductChartPoint {
  period: string;
  value: string;
}

function cleanParams(params: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== ""),
  );
}

export function useGetProductWiseSummary(params: ProductWiseParams) {
  return useQuery<ProductWiseSummary>({
    queryKey: ["product-wise", "summary", params],
    queryFn: async () => {
      const res = await api.get(API_ENDPOINTS.finances.PRODUCT_WISE_SUMMARY, {
        params: cleanParams(params as Record<string, unknown>),
      });

      return res.data.data as ProductWiseSummary;
    },
  });
}

export function useGetProductWiseTable(params: ProductWiseParams) {
  return useQuery<ProductTableResponse>({
    queryKey: ["product-wise", "table", params],
    queryFn: async () => {
      const res = await api.get(API_ENDPOINTS.finances.PRODUCT_WISE_TABLE, {
        params: cleanParams(params as Record<string, unknown>),
      });

      return res.data.data as ProductTableResponse;
    },
  });
}

export function useGetProductWiseChart(params: {
  date_from?: string;
  date_to?: string;
  product_id?: string;
  metric?: string;
  time_grouping?: string;
}) {
  return useQuery<ProductChartPoint[]>({
    queryKey: ["product-wise", "chart", params],
    queryFn: async () => {
      const res = await api.get(API_ENDPOINTS.finances.PRODUCT_WISE_CHART, {
        params: cleanParams(params as Record<string, unknown>),
      });
      
      return res.data.data as ProductChartPoint[];
    },
  });
}
