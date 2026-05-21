import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";

export interface SalesByItemsParams {
  search?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  size?: number;
}

export interface TopFiveItem {
  item_name: string;
  total_sales: string;
}

export interface SalesTableRow {
  item_name: string;
  quantity_sold: string;
  gross_sale: string;
  total_discounts: string;
  total_commissions: string;
  total_refunds: string;
  net_sales: string;
}

export interface SalesTableResponse {
  data: SalesTableRow[];
  pagination: {
    page: number;
    size: number;
    total: number | string;
    total_pages: number;
  };
}

function cleanParams(params: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== ""),
  );
}

export function useGetSalesByItemsTop5(params: { date_from?: string; date_to?: string } = {}) {
  return useQuery<TopFiveItem[]>({
    queryKey: ["sales-by-items", "top5", params],
    queryFn: async () => {
      const res = await api.get(API_ENDPOINTS.finances.SALES_BY_ITEMS_TOP5, {
        params: cleanParams(params as Record<string, unknown>),
      });

      
return res.data.data as TopFiveItem[];
    },
  });
}

export function useGetSalesByItemsTable(params: SalesByItemsParams) {
  return useQuery<SalesTableResponse>({
    queryKey: ["sales-by-items", "table", params],
    queryFn: async () => {
      const res = await api.get(API_ENDPOINTS.finances.SALES_BY_ITEMS_TABLE, {
        params: cleanParams(params as Record<string, unknown>),
      });

      
return res.data.data as SalesTableResponse;
    },
  });
}
