import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

export interface CreateOrderPayload {
  student_user_id: string;
  product_id: string;
  quantity: number;
  payment_method: "BANK_TRANSFER" | "CARD";
  evidence_url?: string;
  delivery_details?: {
    mobile_number: string;
    whatsapp_number?: string;
    address_line_1: string;
    address_line_2?: string;
    district: string;
    city: string;
    postal_code: string;
  };
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateOrderPayload) => {
      const response = await api.post(API_ENDPOINTS.orders.CREATE_ORDER, payload);

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.orders] });
      toast.success("Order created successfully.");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create order.");
    },
  });
}
