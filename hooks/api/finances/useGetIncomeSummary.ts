import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";

interface IncomeSummaryRaw {
  total_payments: string | null;
  total_payments_batches: string | null;
  total_payments_courses: string | null;
  total_payments_products: string | null;
}

export interface IncomeSummary {
  total_all: string | null;
  total_batches: string | null;
  total_courses: string | null;
  total_products: string | null;
}

export function useGetIncomeSummary() {
  return useQuery<IncomeSummary>({
    queryKey: ["finances", "income-summary"],
    queryFn: async () => {
      const res = await api.get(API_ENDPOINTS.finances.INCOME_SUMMARY);
      const raw = res.data.data as IncomeSummaryRaw;
      
      return {
        total_all: raw.total_payments,
        total_batches: raw.total_payments_batches,
        total_courses: raw.total_payments_courses,
        total_products: raw.total_payments_products,
      };
    },
  });
}
