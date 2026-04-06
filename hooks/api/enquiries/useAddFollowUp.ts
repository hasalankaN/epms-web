import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";
import type { AddFollowUpDto, EnquiryDetail } from "@/types/inquiry";

export function useAddFollowUp(enquiryId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: AddFollowUpDto) => {
      const response = await api.post<{ data: EnquiryDetail }>(
        API_ENDPOINTS.enquiries.ADD_FOLLOWUP(enquiryId),
        payload
      );

      return response.data.data;
    },
    onSuccess: () => {
      // Invalidate the enquiry detail and listing to refresh data
      queryClient.invalidateQueries({ queryKey: [queryKeys.enquiries] });
      toast.success("Follow-up added successfully");
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Failed to add follow-up";

      toast.error(errorMessage);
    },
  });
}
