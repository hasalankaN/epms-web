import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";

export const useToggleReferralStudentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (studentUserId: string) => {
      const { data } = await api.patch(API_ENDPOINTS.referrals.STUDENT_STATUS(studentUserId));

      return data;
    },
    onSuccess: (response) => {
      toast.success(response.data?.message || "Status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["referral-students"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update status");
    },
  });
};
