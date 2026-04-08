import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

interface BulkDeletePayload {
  ids: string[];
}

interface BulkDeleteResponse {
  status: string;
  message: string | null;
  data: {
    message: string;
    deleted: number;
  };
}

export function useBulkDeleteDocumentTemplates() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: BulkDeletePayload) => {
      const response = await api.delete<BulkDeleteResponse>(
        API_ENDPOINTS.documentTemplates.DELETE_BULK,
        { data: payload }
      );

      return response.data;
    },
    onSuccess: (data) => {
      if (data.status === "SUCCESS") {
        toast.success(data.data.message || "Document templates deleted successfully.");
        queryClient.invalidateQueries({ queryKey: [queryKeys.documentTemplates] });
      } else {
        toast.error(data.message || "Failed to delete document templates.");
      }
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || "An error occurred while deleting the document templates.";

      toast.error(errorMessage);
    },
  });
}
