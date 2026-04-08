import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

interface DeleteDocumentTemplateResponse {
  status: string;
  message: string | null;
  data: {
    message: string;
  };
}

export function useDeleteDocumentTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete<DeleteDocumentTemplateResponse>(
        API_ENDPOINTS.documentTemplates.DELETE(id)
      );

      return response.data;
    },
    onSuccess: (data) => {
      if (data.status === "SUCCESS") {
        toast.success("Document template deleted successfully.");
        queryClient.invalidateQueries({ queryKey: [queryKeys.documentTemplates] });
      } else {
        toast.error(data.message || "Failed to delete document template.");
      }
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || "An error occurred while deleting the document template.";

      toast.error(errorMessage);
    },
  });
}
