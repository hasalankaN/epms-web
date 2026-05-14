import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import type { CommonResponseDataType } from "@/types/common";

export interface LecturerPayment {
  id: string;
  period: string;
  description: string;
  amount: string;
  status: "PENDING" | "PAID";
  paidDate?: string;
  receiptUrl?: string;
}

interface LecturerPaymentHistoryResponse {
  payments: LecturerPayment[];
  totalResults: number;
  page: number;
  size: number;
  totalPages: number;
}

export const useGetLecturerPayments = (page = 1, size = 20) => {
  return useQuery({
    queryKey: ["lecturer-payments", page, size],
    queryFn: async () => {
      const { data } = await api.get<CommonResponseDataType<LecturerPaymentHistoryResponse>>(
        "/api/v1/lecturer/profile/payments",
        {
          params: { page, size },
        }
      );
      return data.data;
    },
  });
};
