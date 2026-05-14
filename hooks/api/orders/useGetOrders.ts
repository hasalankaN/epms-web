import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

export type OrderStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "DISPATCHED" | "REFUNDED" | "DOWNLOADED";
export type ProductType = "DIGITAL" | "DELIVERY";

export interface GetOrdersParams {
  page?: number;
  size?: number;
  orderBy?: string;
  order?: "asc" | "desc";
  search?: string;
  date?: string;
  status?: OrderStatus;
  product_type?: ProductType;
}

export interface OrderResponseItem {
  order_id: string;
  order_number: string | null;
  order_date: string;
  ordered_product: string;
  ordered_quantity: number;
  customer_name: string;
  product_type: ProductType;
  payment_method: string;
  order_amount: string;
  order_status: OrderStatus;
  commissions: string;
}

export interface GetOrdersResponse {
  data: OrderResponseItem[];
  meta: {
    total: number;
    page: number;
    size: number;
    totalPages: number;
  };
}

export function useGetOrders(params: GetOrdersParams) {
  // Clean params - only include defined values
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== "")
  );

  return useQuery<GetOrdersResponse>({
    queryKey: [queryKeys.orders, cleanParams],
    queryFn: async () => {
      const apiParams: Record<string, any> = {
        page: params.page || 1,
        size: params.size || 20,
      };

      // Only add optional params if they have values
      if (params.orderBy) apiParams.orderBy = params.orderBy;
      if (params.order) apiParams.order = params.order;
      if (params.search) apiParams.search = params.search;
      if (params.date) apiParams.date = params.date;
      if (params.status) apiParams.status = params.status;
      if (params.product_type) apiParams.product_type = params.product_type;

      const response = await api.get(API_ENDPOINTS.orders.GET_ALL, {
        params: apiParams,
      });
      
      return response.data.data;
    },
  });
}
