import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/lib/axios";

export const useToggleReferralStudentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (studentUserId: string) => {
      const { data } = await api.patch(`/api/v1/admin/referrals/students/${studentUserId}/status`);
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
