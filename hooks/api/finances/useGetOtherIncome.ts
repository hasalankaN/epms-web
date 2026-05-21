import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";

export interface OtherIncomeParams {
  page?: number;
  size?: number;
  transaction_via?: string;
  date_from?: string;
  date_to?: string;
}

export interface OtherIncomeItem {
  id: string;
  transaction_date: string;
  description: string;
  amount: string;
  transaction_via: string;
  branch_name: string | null;
  evidence_url: string | null;
}

export interface OtherIncomeResponse {
  data: OtherIncomeItem[];
  meta: { total: number; page: number; size: number; totalPages: number };
}

export function useGetOtherIncome(params: OtherIncomeParams) {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== ""),
  );

  return useQuery<OtherIncomeResponse>({
    queryKey: ["finances", "other-income", cleanParams],
    queryFn: async () => {
      const res = await api.get(API_ENDPOINTS.finances.OTHER_INCOME_LIST, { params: cleanParams });
      
      return res.data.data as OtherIncomeResponse;
    },
  });
}
