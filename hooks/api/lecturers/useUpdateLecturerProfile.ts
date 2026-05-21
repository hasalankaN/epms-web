import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";

export interface UpdateLecturerProfileRequest {
  mobileNumber?: string;
  whatsappNumber?: string;
  profileImageUrl?: string;
}

export function useUpdateLecturerProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateLecturerProfileRequest) => {
      const response = await api.put(API_ENDPOINTS.lecturer.PROFILE, data);

      
return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lecturer-profile"] });
      toast.success("Profile updated successfully");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Failed to update profile";

      toast.error(message);
    },
  });
}
