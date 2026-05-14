import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";

interface GetOrderInvoiceParams {
  orderId: string;
}

/**
 * Hook to fetch renderable invoice context for an order.
 */
export function useGetOrderInvoice() {
  return useMutation({
    mutationFn: async ({ orderId }: GetOrderInvoiceParams) => {
      const response = await api.get(
        API_ENDPOINTS.orders.GET_INVOICE(orderId)
      );

      return response.data;
    },
    onMutate: () => {
      toast.loading("Fetching invoice details...", { id: "order-invoice" });
    },
    onSuccess: (data) => {
      toast.success("Invoice ready to print.", { id: "order-invoice" });

      // Logic to handle the data for printing would go here
      console.log("Invoice Data:", data);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to fetch invoice.", { id: "order-invoice" });
    },
  });
}
