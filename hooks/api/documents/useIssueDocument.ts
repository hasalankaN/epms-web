import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";
import type { IssueDocumentPayload } from "@/types/document";

export function useIssueDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: IssueDocumentPayload) => {
      const response = await api.post(
        API_ENDPOINTS.issuedDocuments.ISSUE,
        payload,
      );

      return response.data;
    },
    onSuccess: () => {
      toast.success("Document issued successfully.");
      queryClient.invalidateQueries({ queryKey: [queryKeys.issuedDocuments] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to issue document.",
      );
    },
  });
}
