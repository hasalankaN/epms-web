import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

export interface UpdateLecturerPayload {
  first_name?: string;
  last_name?: string;
  mobile_number?: string;
  whatsapp_number?: string;
  nic?: string;
  district?: string;
  gender?: "MALE" | "FEMALE";
  profile_image_url?: string;
  salary_type?:
    | "MONTHLY"
    | "PERCENTAGE_FROM_BATCH_DEPOSITS"
    | "COURSE_WISE_PAYMENTS"
    | "BATCH_WISE_PAYMENTS";
  salary_due_day?: string;
  salary_due_frequency?: string;
  branch_id?: string;
}

export function useUpdateLecturer(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateLecturerPayload) => {
      const { data } = await api.patch(API_ENDPOINTS.lecturers.UPDATE(id), payload);

      return data;
    },
    onSuccess: () => {
      toast.success("Lecturer updated successfully.");
      queryClient.invalidateQueries({ queryKey: [queryKeys.lecturers] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update lecturer.");
    },
  });
}
