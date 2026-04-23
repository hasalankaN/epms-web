import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

export type BulkOrderStatus = "PROCESSING" | "DISPATCHED" | "COMPLETED" | "REFUNDED";

interface BulkUpdateOrderStatusPayload {
  ids: string[];
  target_status: BulkOrderStatus;
}

interface BulkUpdateResponse {
  status: string;
  message: string | null;
  data: {
    message: string;
    updated: number;
    failed: number;
    errors?: Array<{ id: string; reason: string }>;
  };
}

export function useBulkUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: BulkUpdateOrderStatusPayload) => {
      const response = await api.patch<BulkUpdateResponse>(
        API_ENDPOINTS.orders.BULK_UPDATE_STATUS,
        payload
      );

      return response.data;
    },
    onMutate: () => {
      toast.loading("Updating orders status...", { id: "bulk-order-status" });
    },
    onSuccess: (data) => {
      if (data.status === "SUCCESS") {
        const { updated, failed, errors, message } = data.data;

        if (failed === 0) {
          toast.success(message || "All orders updated successfully.", { id: "bulk-order-status" });
        } else {
          // Some succeeded, some failed
          const errorMessages = errors?.map((e) => e.reason).join(", ") || "Some orders could not be updated.";
          
          toast.error(`${message} Reason: ${errorMessages}`, { 
            id: "bulk-order-status",
            duration: 5000 
          });
        }

        if (updated > 0) {
          queryClient.invalidateQueries({ queryKey: [queryKeys.orders] });
        }
      } else {
        toast.error(data.message || "Failed to update order statuses.", { id: "bulk-order-status" });
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "An error occurred while updating the orders.", { id: "bulk-order-status" });
    },
  });
}
