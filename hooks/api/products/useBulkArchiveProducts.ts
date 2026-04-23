import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

interface BulkArchivePayload {
  ids: string[];
}

interface BulkArchiveResponse {
  status: string;
  message: string | null;
  data: {
    message: string;
    archived: number;
  };
}

export function useBulkArchiveProducts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: BulkArchivePayload) => {
      const response = await api.patch<BulkArchiveResponse>(
        API_ENDPOINTS.products.ARCHIVE_BULK,
        payload
      );

      return response.data;
    },
    onSuccess: (data) => {
      if (data.status === "SUCCESS") {
        toast.success(data.data.message || "Products archived successfully.");
        queryClient.invalidateQueries({ queryKey: [queryKeys.products] });
      } else {
        toast.error(data.message || "Failed to archive products.");
      }
    },
    onError: () => {
      toast.error("An error occurred while archiving the products.");
    },
  });
}
