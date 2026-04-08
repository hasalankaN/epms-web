import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

export function useToggleDocumentTemplateStatus(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.patch(
        API_ENDPOINTS.documentTemplates.TOGGLE_STATUS(id)
      );

      return data;
    },
    onSuccess: (data) => {
      toast.success(data?.data?.message || "Template status updated successfully.");
      queryClient.invalidateQueries({ queryKey: [queryKeys.documentTemplates] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to update template status."
      );
    },
  });
}
