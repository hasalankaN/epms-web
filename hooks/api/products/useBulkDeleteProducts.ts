import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

interface BulkDeletePayload {
  ids: string[];
}

interface BulkDeleteResponse {
  status: string;
  message: string | null;
  data: {
    message: string;
    deleted: number;
  };
}

export function useBulkDeleteProducts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: BulkDeletePayload) => {
      const response = await api.delete<BulkDeleteResponse>(
        API_ENDPOINTS.products.DELETE_BULK,
        { data: payload } // Axios requires delete payloads inside the `data` config key
      );

      return response.data;
    },
    onSuccess: (data) => {
      if (data.status === "SUCCESS") {
        toast.success(data.data.message || "Products deleted successfully.");
        queryClient.invalidateQueries({ queryKey: [queryKeys.products] });
      } else {
        toast.error(data.message || "Failed to delete products.");
      }
    },
    onError: () => {
      toast.error("An error occurred while deleting the products.");
    },
  });
}
