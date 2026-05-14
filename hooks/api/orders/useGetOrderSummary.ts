import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";
import type { OrderSummaryData } from "@/types/product";

export function useGetOrderSummary() {
  return useQuery({
    queryKey: [queryKeys.orders, "summary"],
    queryFn: async () => {
      const response = await api.get<{ data: OrderSummaryData }>(
        API_ENDPOINTS.orders.GET_SUMMARY
      );

      return response.data.data;
    },
  });
}
