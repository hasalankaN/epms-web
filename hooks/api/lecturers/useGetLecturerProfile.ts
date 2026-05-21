import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";

export interface LecturerOwnProfile {
  userId: string;
  publicId: string;
  firstName: string;
  lastName: string;
  email: string;
  nic: string;
  mobileNumber: string;
  whatsappNumber: string;
  gender: "MALE" | "FEMALE";
  district: string;
  profileImageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface LecturerOwnProfileResponse {
  status: string;
  message: string | null;
  data: LecturerOwnProfile;
}

export function useGetLecturerProfile() {
  return useQuery({
    queryKey: ["lecturer-profile"],
    queryFn: async () => {
      const response = await api.get<LecturerOwnProfileResponse>(
        API_ENDPOINTS.lecturer.PROFILE
      );

      
return response.data.data;
    },
  });
}
