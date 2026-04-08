import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";
import type { CreateDocumentTemplatePayload } from "@/types/document";

export interface CreateDocumentTemplateResponse {
  id: string;
}

export function useCreateDocumentTemplate() {
  const queryClient = useQueryClient();

  return useMutation<CreateDocumentTemplateResponse, Error, CreateDocumentTemplatePayload>({
    mutationFn: async (payload) => {
      const response = await api.post(API_ENDPOINTS.documentTemplates.CREATE, payload);

      return response.data.data;
    },
    onSuccess: () => {
      toast.success("Document template created successfully");
      queryClient.invalidateQueries({ queryKey: [queryKeys.documentTemplates] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create document template";

      toast.error(message);
    },
  });
}
