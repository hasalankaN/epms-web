import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

export interface UpdateStaffStatusPayload {
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
}

export function useUpdateStaffStatus(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateStaffStatusPayload) => {
      const { data } = await api.patch(
        API_ENDPOINTS.staff.UPDATE_STATUS(id),
        payload
      );

      return data;
    },
    onSuccess: (data) => {
      toast.success(data?.data?.message || "Staff status updated successfully.");
      queryClient.invalidateQueries({ queryKey: [queryKeys.staff] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to update staff status."
      );
    },
  });
}
