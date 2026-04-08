import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/constants/queryKeys";

interface UpdateStatusParams {
  id: string;
  status: string;
}

/**
 * Hook to update the status of a certificate request.
 * NOTE: Currently mocked as the backend endpoint is missing.
 */
export function useUpdateCertificateStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: UpdateStatusParams) => {
      // Mocking the API call since the endpoint is missing
      // Real endpoint would likely be PATCH /api/v1/admin/certificate-requests/:id/status
      console.log(`[MOCK API] Patching certificate ${id} status to ${status}`);
      
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ status: "SUCCESS" });
        }, 800);
      });
    },
    onSuccess: (_, { status }) => {
      toast.success(`Certificate status updated to ${status.toLowerCase()} (Mocked)`);
      queryClient.invalidateQueries({ queryKey: [queryKeys.certificateRequests] });
    },
    onError: () => {
      toast.error("Failed to update certificate status.");
    },
  });
}
