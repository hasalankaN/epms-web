import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

export interface UpdateStaffPayload {
  first_name?: string;
  last_name?: string;
  mobile_number?: string;
  whatsapp_number?: string;
  nic?: string;
  district?: string;
  gender?: "MALE" | "FEMALE";
  profile_image_url?: string;
  salary_type?: "MONTHLY" | "PERCENTAGE_FROM_BATCH_DEPOSITS" | "BATCH_OR_COURSE_WISE_PAYMENT";
  salary_due_day?: string;
  salary_due_frequency?: string;
  is_branch_manager?: boolean;
  branch_id?: string;
}

export function useUpdateStaff(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateStaffPayload) => {
      const { data } = await api.patch(API_ENDPOINTS.staff.UPDATE(id), payload);

      return data;
    },
    onSuccess: () => {
      toast.success("Staff updated successfully.");
      queryClient.invalidateQueries({ queryKey: [queryKeys.staff] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update staff.");
    },
  });
}
