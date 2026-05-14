import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";

interface GetOrderWaybillParams {
  orderId: string;
}

/**
 * Hook to fetch delivery waybill for a delivery order.
 */
export function useGetOrderWaybill() {
  return useMutation({
    mutationFn: async ({ orderId }: GetOrderWaybillParams) => {
      const response = await api.get(
        API_ENDPOINTS.orders.GET_WAYBILL(orderId)
      );

      return response.data;
    },
    onMutate: () => {
      toast.loading("Fetching delivery waybill...", { id: "order-waybill" });
    },
    onSuccess: (data) => {
      toast.success("Delivery waybill ready.", { id: "order-waybill" });

      // Logic to handle the data for printing would go here
      console.log("Waybill Data:", data);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to fetch waybill.", { id: "order-waybill" });
    },
  });
}
