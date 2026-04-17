import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

interface UpdateStatusParams {
  id: string;
  status: string;
}

/**
 * Hook to update the status of a certificate request.
 */
export function useUpdateCertificateStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: UpdateStatusParams) => {
      const response = await api.patch(
        API_ENDPOINTS.certificateRequests.UPDATE_STATUS(id),
        { status }
      );

      return response.data;
    },
    onSuccess: (_, { status }) => {
      toast.success(`Certificate status updated to ${status.toLowerCase()}`);
      queryClient.invalidateQueries({ queryKey: [queryKeys.certificateRequests] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update certificate status.");
    },
  });
}
