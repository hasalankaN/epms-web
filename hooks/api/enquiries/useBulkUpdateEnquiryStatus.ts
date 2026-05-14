import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

interface BulkUpdateStatusPayload {
  ids: string[];
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "NO_RESPONSE";
}

interface BulkUpdateResponse {
  status: string;
  message: string | null;
  data: {
    message: string;
    updated: number;
  };
}

export function useBulkUpdateEnquiryStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: BulkUpdateStatusPayload) => {
      const response = await api.patch<BulkUpdateResponse>(
        API_ENDPOINTS.enquiries.BULK_UPDATE_STATUS,
        payload
      );

      return response.data;
    },
    onSuccess: (data) => {
      if (data.status === "SUCCESS") {
        toast.success(data.data.message || "Enquiry statuses updated successfully.");
        queryClient.invalidateQueries({ queryKey: [queryKeys.enquiries] });
      } else {
        toast.error(data.message || "Failed to update enquiry statuses.");
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "An error occurred while updating the enquiries.");
    },
  });
}
