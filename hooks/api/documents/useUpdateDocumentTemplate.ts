import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";
import type { UpdateDocumentTemplatePayload, DocumentTemplateDetail } from "@/types/document";

export interface UpdateDocumentTemplateResponse {
  status: string;
  message: string | null;
  data: DocumentTemplateDetail;
}

export function useUpdateDocumentTemplate(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateDocumentTemplatePayload) => {
      const response = await api.patch<UpdateDocumentTemplateResponse>(
        API_ENDPOINTS.documentTemplates.UPDATE(id),
        payload
      );

      return response.data;
    },
    onSuccess: () => {
      toast.success("Document template updated successfully.");
      queryClient.invalidateQueries({ queryKey: [queryKeys.documentTemplates] });
    },
    onError: () => {
      toast.error("Failed to update document template. Please try again.");
    },
  });
}
