import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

interface RestoreProductResponse {
  status: string;
  message: string | null;
  data: any;
}

export function useRestoreProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.patch<RestoreProductResponse>(
        API_ENDPOINTS.products.RESTORE(id)
      );

      return response.data;
    },
    onSuccess: (data) => {
      if (data.status === "SUCCESS") {
        toast.success("Product restored successfully.");
        queryClient.invalidateQueries({ queryKey: [queryKeys.products] });
      } else {
        toast.error(data.message || "Failed to restore product.");
      }
    },
    onError: () => {
      toast.error("An error occurred while restoring the product.");
    },
  });
}
