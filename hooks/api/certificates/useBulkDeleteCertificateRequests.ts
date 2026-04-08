import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/constants/queryKeys";

export function useBulkDeleteCertificateRequests() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      // Mocking the bulk delete as the backend endpoint is missing
      // It would likely be DELETE /api/v1/admin/certificate-requests/bulk
      console.log(`[MOCK API] Bulk deleting certificate requests:`, ids);

      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ status: "SUCCESS" });
        }, 800);
      });
    },
    onSuccess: (_, ids) => {
      toast.success(`${ids.length} certificate requests deleted successfully (Mocked).`);
      queryClient.invalidateQueries({ queryKey: [queryKeys.certificateRequests] });
    },
    onError: () => {
      toast.error("Failed to delete certificate requests.");
    },
  });
}
