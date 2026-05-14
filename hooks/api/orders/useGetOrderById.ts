import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

export interface OrderDetailCustomer {
  id: string;
  full_name: string;
  email: string;
  mobile_number: string | null;
  whatsapp_number: string | null;
}

export interface OrderDetailProduct {
  id: string;
  name: string;
  type: "DIGITAL" | "DELIVERY";
}

export interface OrderDetailDelivery {
  id: string | null;
  mobile_number: string | null;
  whatsapp_number: string | null;
  address_line_1: string | null;
  address_line_2: string | null;
  district: string | null;
  city: string | null;
  postal_code: string | null;
}

export interface OrderPayment {
  method: "BANK_TRANSFER" | "CARD";
  amount: string;
  status: "PENDING" | "VERIFIED" | "REJECTED";
  created_at: string;
  receipt_url: string | null;
}

export interface OrderDetailResponse {
  id: string;
  order_number: string | null;
  created_at: string;
  financial_status: "PAYMENT_PENDING" | "SUBMITTED_BANK_TRANSFER" | "PAID" | "CANCELLED" | "REFUNDED";
  fulfillment_status: "PENDING" | "DELIVERED" | "SHIPPED" | "CANCELLED";
  status: "PENDING" | "PROCESSING" | "DISPATCHED" | "COMPLETED" | "DOWNLOADED" | "REFUNDED";
  quantity: number;
  unit_price: string;
  total_amount: string;
  referral_discount: string;
  customer: OrderDetailCustomer;
  product: OrderDetailProduct;
  delivery: OrderDetailDelivery | null;
  commission: number;
  payments: OrderPayment[];
}

export function useGetOrderById(id: string | null) {
  return useQuery<OrderDetailResponse>({
    queryKey: [queryKeys.orders, id],
    queryFn: async () => {
      const response = await api.get(API_ENDPOINTS.orders.GET_BY_ID(id as string));
      
      return response.data.data;
    },
    enabled: !!id,
  });
}
