import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";
import type { BranchType } from "@/types/branch";

export interface UpdateBranchPayload {
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  branch_type: BranchType;
}

export function useUpdateBranch(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateBranchPayload) => {
      const response = await api.patch(API_ENDPOINTS.branches.GET_BY_ID(id), payload);
      
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.branches] });
      toast.success("Branch updated successfully.");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update branch.");
    },
  });
}
