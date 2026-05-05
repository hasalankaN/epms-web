import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

export interface CreateLecturerPayload {
  email: string;
  first_name: string;
  last_name: string;
  mobile_number: string;
  whatsapp_number?: string;
  nic?: string;
  district?: string;
  gender?: "MALE" | "FEMALE";
  profile_image_url?: string;
  salary_type:
    | "MONTHLY"
    | "PERCENTAGE_FROM_BATCH_DEPOSITS"
    | "COURSE_WISE_PAYMENTS"
    | "BATCH_WISE_PAYMENTS";
  salary_due_day?: string;
  salary_due_frequency?: string;
  branch_id?: string;
}

export function useCreateLecturer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateLecturerPayload) => {
      const response = await api.post(API_ENDPOINTS.lecturers.CREATE, payload);

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.lecturers] });
      toast.success("Lecturer created successfully.");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create lecturer.");
    },
  });
}
