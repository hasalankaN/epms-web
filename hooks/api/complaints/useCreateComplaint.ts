import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

export interface CreateComplaintPayload {
  type: "REQUEST" | "COMPLAINT";
  holder_name: string;
  mobile_number: string;
  description: string;
  notes?: string;
  assignee_user_id: string;
}

export function useCreateComplaint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateComplaintPayload) => {
      const response = await api.post(API_ENDPOINTS.complaints.CREATE, payload);

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.complaints] });
      toast.success("Complaint created successfully.");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create complaint.");
    },
  });
}
