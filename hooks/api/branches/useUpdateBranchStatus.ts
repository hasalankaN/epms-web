import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

export function useUpdateBranchStatus(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await api.patch(API_ENDPOINTS.branches.UPDATE_STATUS(id));

      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.branches] });
      const newStatus = data.data.status;

      toast.success(`Branch ${newStatus === "ACTIVE" ? "activated" : "deactivated"} successfully.`);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update branch status.");
    },
  });
}
