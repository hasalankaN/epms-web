import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

export interface CreateEnquiryPayload {
  name: string;
  phone: string;
  whatsapp_number?: string;
  nic?: string;
  email?: string;
  district?: string;
  batch_id?: string;
  course_id?: string;
  branch_id?: string;
  assignee_user_id: string;
  next_follow_up_at?: string;
  notes?: string;
}

export function useCreateEnquiry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateEnquiryPayload) => {
      const response = await api.post(API_ENDPOINTS.enquiries.CREATE, payload);

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.enquiries] });
      toast.success("Enquiry created successfully.");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create enquiry.");
    },
  });
}
