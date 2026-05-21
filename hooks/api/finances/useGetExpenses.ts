import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";

export type ExpenseEntityType = "BATCH" | "COURSE" | "PRODUCT" | "GENERAL";

export interface ExpenseParams {
  related_entity_type?: ExpenseEntityType;
  date?: string;
  date_from?: string;
  date_to?: string;
  transaction_via?: string;
  search?: string;
  page?: number;
  size?: number;
}

export interface ExpenseRecord {
  id: string;
  expense_code: string;
  date: string;
  description: string;
  amount: string;
  transaction_via: string;
  related_entity_type: ExpenseEntityType;
  related_entity_name: string | null;
  expense_type?: string;
}

export interface ExpenseListResponse {
  results: ExpenseRecord[];
  totalResults: number;
  page: number;
  size: number;
  totalPages: number;
  isFirstPage: boolean;
  isLastPage: boolean;
}

export interface CreateExpensePayload {
  related_entity_type: ExpenseEntityType;
  description: string;
  amount: number;
  date: string;
  transaction_via: string;
  branch_id: string;
  related_entity_id?: string;
  notes?: string;
}

function cleanParams(params: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== ""),
  );
}

export function useGetExpenses(params: ExpenseParams) {
  return useQuery<ExpenseListResponse>({
    queryKey: ["finances", "expenses", params],
    queryFn: async () => {
      const res = await api.get(API_ENDPOINTS.finances.EXPENSES_LIST, {
        params: cleanParams(params as Record<string, unknown>),
      });

      return res.data.data as ExpenseListResponse;
    },
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateExpensePayload) => {
      const res = await api.post(API_ENDPOINTS.finances.EXPENSES_CREATE, payload);
      
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["finances", "expenses"] });
    },
  });
}
