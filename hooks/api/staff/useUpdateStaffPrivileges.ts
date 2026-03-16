import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

export interface UpdateStaffPrivilegesPayload {
  privilege_codes: string[];
}

export function useUpdateStaffPrivileges(staffId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateStaffPrivilegesPayload) => {
      const response = await api.patch(API_ENDPOINTS.staff.UPDATE_PRIVILEGES(staffId), payload);

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.staff] });
      toast.success("Staff privileges updated successfully.");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update staff privileges.");
    },
  });
}
