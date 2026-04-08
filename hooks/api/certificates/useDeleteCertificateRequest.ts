import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

export function useDeleteCertificateRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(
        API_ENDPOINTS.certificateRequests.DELETE(id)
      );

      return response.data;
    },
    onSuccess: () => {
      toast.success("Certificate request deleted successfully.");
      queryClient.invalidateQueries({ queryKey: [queryKeys.certificateRequests] });
    },
    onError: () => {
      toast.error("Failed to delete certificate request.");
    },
  });
}
