import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

interface DeleteEnquiryResponse {
  status: string;
  message: string | null;
  data: {
    message: string;
  };
}

export function useDeleteEnquiry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete<DeleteEnquiryResponse>(
        API_ENDPOINTS.enquiries.DELETE(id)
      );

      return response.data;
    },
    onSuccess: (data) => {
      if (data.status === "SUCCESS") {
        toast.success("Enquiry deleted successfully.");
        queryClient.invalidateQueries({ queryKey: [queryKeys.enquiries] });
      } else {
        toast.error(data.message || "Failed to delete enquiry.");
      }
    },
    onError: () => {
      toast.error("An error occurred while deleting the enquiry.");
    },
  });
}
