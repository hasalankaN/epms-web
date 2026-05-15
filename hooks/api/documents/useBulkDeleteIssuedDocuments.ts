import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

interface BulkDeleteIssuedPayload {
  ids: string[];
  reason: string;
}

export function useBulkDeleteIssuedDocuments() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: BulkDeleteIssuedPayload) => {
      const response = await api.delete(
        API_ENDPOINTS.issuedDocuments.DELETE_BULK,
        {
          data: payload,
        },
      );

      return response.data;
    },
    onSuccess: (data) => {
      toast.success(
        data?.data?.deleted
          ? `${data.data.deleted} document(s) deleted successfully.`
          : "Documents deleted successfully.",
      );
      queryClient.invalidateQueries({ queryKey: [queryKeys.issuedDocuments] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to delete issued documents.",
      );
    },
  });
}
