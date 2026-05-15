import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

interface DeleteIssuedDocumentPayload {
  id: string;
  reason: string;
}

export function useDeleteIssuedDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, reason }: DeleteIssuedDocumentPayload) => {
      const response = await api.delete(
        API_ENDPOINTS.issuedDocuments.DELETE(id),
        {
          data: { reason },
        },
      );

      return response.data;
    },
    onSuccess: () => {
      toast.success("Issued document deleted successfully.");
      queryClient.invalidateQueries({ queryKey: [queryKeys.issuedDocuments] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to delete issued document.",
      );
    },
  });
}
