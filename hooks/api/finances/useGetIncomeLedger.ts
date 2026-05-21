import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";

export interface LedgerParams {
  page?: number;
  size?: number;
  search?: string;
  date_from?: string;
  date_to?: string;
  source?: "BATCH" | "COURSE" | "PRODUCT";
  payment_method?: "GATEWAY" | "BANK_TRANSFER";
  payment_type?: string;
  payment_via?: string;
  status?: "COMPLETED" | "PENDING" | "REFUNDED";
}

export interface LedgerItem {
  id: string;
  transaction_date: string;
  source_name: string;
  source_type: "BATCH" | "COURSE" | "PRODUCT";
  payment_method: "GATEWAY" | "BANK_TRANSFER";
  payment_type: string;
  payment_type_label: string | null;
  payment_via: string | null;
  ledger_status: "COMPLETED" | "PENDING" | "REFUNDED";
  amount: string;
  invoice_number: string | null;
  student_email: string | null;
  student_name: string | null;
}

export interface LedgerResponse {
  data: LedgerItem[];
  meta: { total: number; page: number; size: number; totalPages: number };
}

export function useGetIncomeLedger(params: LedgerParams) {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== ""),
  );

  return useQuery<LedgerResponse>({
    queryKey: ["finances", "income-ledger", cleanParams],
    queryFn: async () => {
      const res = await api.get(API_ENDPOINTS.finances.INCOME_LEDGER, { params: cleanParams });
      
      return res.data.data as LedgerResponse;
    },
  });
}
