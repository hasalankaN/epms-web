import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

export interface CreateStudentPayload {
  full_name: string;
  email: string;
  mobile_number: string;
  mobile_number_2?: string;
  whatsapp_number: string;
  gender: "MALE" | "FEMALE";
  nic: string;
  dob: string; // ISO date string
  district: string;
  guardian_name: string;
  guardian_phone: string;
  ol_result_image_url?: string;
  al_result_image_url?: string;
  nic_front_image_url?: string;
  nic_back_image_url?: string;
  profile_image_url?: string;
}

export function useCreateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateStudentPayload) => {
      const response = await api.post(API_ENDPOINTS.adminStudents.CREATE, payload);

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.students] });
      toast.success("Student created successfully.");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create student.");
    },
  });
}
