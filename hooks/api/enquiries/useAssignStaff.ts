import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";
import type { AssignStaffDto, EnquiryDetail } from "@/types/inquiry";

export function useAssignStaff(enquiryId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: AssignStaffDto) => {
      const response = await api.patch<{ data: EnquiryDetail }>(
        API_ENDPOINTS.enquiries.ASSIGN_STAFF(enquiryId),
        payload
      );

      return response.data.data;
    },
    onSuccess: () => {
      // Invalidate the enquiry detail and listing to refresh data
      queryClient.invalidateQueries({ queryKey: [queryKeys.enquiries] });
      toast.success("Staff member assigned successfully");
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Failed to assign staff member";
      
      toast.error(errorMessage);
    },
  });
}
