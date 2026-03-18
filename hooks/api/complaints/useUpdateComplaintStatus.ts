import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

export interface UpdateComplaintStatusPayload {
  target_status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
}

export function useUpdateComplaintStatus(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateComplaintStatusPayload) => {
      const { data } = await api.patch(
        API_ENDPOINTS.complaints.UPDATE_STATUS(id),
        payload
      );

      return data;
    },
    onSuccess: () => {
      toast.success("Complaint status updated successfully.");
      queryClient.invalidateQueries({ 
        queryKey: [queryKeys.complaints], 
      });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update complaint status.");
    },
  });
}
