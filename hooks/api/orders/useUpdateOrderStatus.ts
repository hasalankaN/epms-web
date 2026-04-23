import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

export type OrderTargetStatus = "PROCESSING" | "DISPATCHED" | "COMPLETED" | "REFUNDED";

export interface UpdateOrderStatusPayload {
  id: string;
  target_status: OrderTargetStatus;
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, target_status }: UpdateOrderStatusPayload) => {
      const response = await api.patch(API_ENDPOINTS.orders.UPDATE_STATUS(id), {
        target_status,
      });
      
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.orders] });
      toast.success(data?.message || "Order status updated successfully.");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update order status.");
    },
  });
}
