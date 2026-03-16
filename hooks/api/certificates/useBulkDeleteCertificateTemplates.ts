import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

export interface BulkDeleteTemplatesPayload {
  ids: string[];
}

export function useBulkDeleteCertificateTemplates() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: BulkDeleteTemplatesPayload) => {
      const response = await api.delete(
        API_ENDPOINTS.certificateTemplates.DELETE_BULK,
        { data: payload }
      );

      return response.data;
    },
    onSuccess: () => {
      toast.success("Selected certificate templates deleted successfully.");
      queryClient.invalidateQueries({ queryKey: [queryKeys.certificateTemplates] });
    },
    onError: () => {
      toast.error("Failed to delete selected certificate templates.");
    },
  });
}
