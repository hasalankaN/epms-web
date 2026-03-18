import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

export interface AssignStaffPayload {
  assignee_user_id: string;
}

export function useAssignStaff(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: AssignStaffPayload) => {
      const { data } = await api.patch(API_ENDPOINTS.complaints.ASSIGN(id), payload);
      
      return data;
    },
    onSuccess: () => {
      toast.success("Staff assigned successfully.");
      queryClient.invalidateQueries({ 
        queryKey: [queryKeys.complaints], 
      });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to assign staff.");
    },
  });
}
