import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

export function useActivateTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.patch(
        API_ENDPOINTS.certificateTemplates.ACTIVATE_TEMPLATE(id)
      );

      return response.data;
    },
    onSuccess: () => {
      toast.success("Certificate template activated successfully.");
      queryClient.invalidateQueries({ queryKey: [queryKeys.certificateTemplates] });
    },
    onError: () => {
      toast.error("Failed to activate certificate template.");
    },
  });
}
