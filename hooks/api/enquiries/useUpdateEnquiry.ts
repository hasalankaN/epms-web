import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

export interface UpdateEnquiryPayload {
  name: string;
  phone: string;
  whatsapp_number?: string | null;
  nic?: string | null;
  email?: string | null;
  district?: string | null;
  batch_id?: string | null;
  course_id?: string | null;
  branch_id?: string | null;
  assignee_user_id?: string | null;
  status: string;
  next_follow_up_at?: string | null;
  notes?: string | null;
}

export function useUpdateEnquiry(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateEnquiryPayload) => {
      const { data } = await api.patch(API_ENDPOINTS.enquiries.UPDATE(id), payload);

      return data;
    },
    onSuccess: () => {
      toast.success("Enquiry updated successfully.");
      queryClient.invalidateQueries({ queryKey: [queryKeys.enquiries] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update enquiry.");
    },
  });
}
