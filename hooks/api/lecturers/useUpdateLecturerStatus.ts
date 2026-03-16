import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

interface UpdateLecturerStatusParams {
  id: string;
  status: "ACTIVE" | "INACTIVE";
}

export function useUpdateLecturerStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: UpdateLecturerStatusParams) => {
      const { data } = await api.patch(API_ENDPOINTS.lecturers.UPDATE_STATUS(id), {
        status,
      });

      return data;
    },
    onSuccess: (data, variables) => {
      toast.success(data.message || `Lecturer status updated to ${variables.status.toLowerCase()}.`);
      queryClient.invalidateQueries({ queryKey: [queryKeys.lecturers] });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || "Failed to update lecturer status.";

      toast.error(errorMessage);
    },
  });
}
