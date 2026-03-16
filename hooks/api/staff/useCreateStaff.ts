import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

export interface CreateStaffPayload {
  email: string;
  first_name: string;
  last_name: string;
  mobile_number: string;
  whatsapp_number?: string;
  nic?: string;
  district?: string;
  gender?: "MALE" | "FEMALE";
  profile_image_url?: string;
  salary_type: "MONTHLY" | "COMMISSION_PER_ENROLLMENT" | "COMMISSION_PER_ENROLLMENT_BY_BRANCH";
  is_branch_manager: boolean;
  branch_id?: string;
  privilege_codes?: string[];
}

export function useCreateStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateStaffPayload) => {
      const response = await api.post(API_ENDPOINTS.staff.CREATE, payload);

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.staff] });
      toast.success("Staff member created successfully.");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create staff member.");
    },
  });
}
