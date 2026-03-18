import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

export function useDeleteComplaint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string | string[]) => {
      const payload = { ids: Array.isArray(ids) ? ids : [ids] };

      const { data } = await api.delete(API_ENDPOINTS.complaints.DELETE(), {
        data: payload
      });

      return data;
    },
    onSuccess: () => {
      toast.success("Complaint(s) deleted successfully.");
      queryClient.invalidateQueries({ 
        queryKey: [queryKeys.complaints],
      });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete complaint.");
    },
  });
}
