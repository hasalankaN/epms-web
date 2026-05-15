import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

export function useResendDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.post(API_ENDPOINTS.issuedDocuments.RESEND(id));

      return response.data;
    },
    onSuccess: () => {
      toast.success("Document resent successfully.");
      queryClient.invalidateQueries({ queryKey: [queryKeys.issuedDocuments] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to resend document.",
      );
    },
  });
}
