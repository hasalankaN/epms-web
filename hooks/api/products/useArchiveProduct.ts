import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

interface ArchiveProductResponse {
  status: string;
  message: string | null;
  data: any;
}

export function useArchiveProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.patch<ArchiveProductResponse>(
        API_ENDPOINTS.products.ARCHIVE(id)
      );

      return response.data;
    },
    onSuccess: (data) => {
      if (data.status === "SUCCESS") {
        toast.success("Product archived successfully.");
        queryClient.invalidateQueries({ queryKey: [queryKeys.products] });
      } else {
        toast.error(data.message || "Failed to archive product.");
      }
    },
    onError: () => {
      toast.error("An error occurred while archiving the product.");
    },
  });
}
