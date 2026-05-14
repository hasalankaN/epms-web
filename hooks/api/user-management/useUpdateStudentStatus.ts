import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

export interface UpdateStudentStatusPayload {
  status: "ACTIVE" | "INACTIVE";
}

export function useUpdateStudentStatus(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateStudentStatusPayload) => {
      const { data } = await api.patch(
        API_ENDPOINTS.adminStudents.UPDATE_STATUS(id),
        payload
      );

      return data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Student status updated successfully.");
      queryClient.invalidateQueries({ queryKey: [queryKeys.students] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to update student status."
      );
    },
  });
}
