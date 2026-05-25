import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

export type IssuedMethod = "EMAIL" | "PRINT" | "BOTH" | "DASHBOARD";

export interface IssueDocumentPayload {
  template_id: string;
  student_user_id: string;
  course_id?: string;
  batch_id?: string;
  issued_method: IssuedMethod;
  email_recipient?: string;
  email_subject?: string;
  email_body?: string;
}

export function useIssueDocument() {
  const queryClient = useQueryClient();

  return useMutation<any, Error, IssueDocumentPayload>({
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
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to issue document.";

      toast.error(message);
    },
  });
}
