import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

export interface LecturerProfile {
  user_id: string;
  public_id: string;
  first_name: string;
  last_name: string;
  email: string;
  mobile_number: string;
  whatsapp_number: string | null;
  nic: string | null;
  district: string | null;
  gender: "MALE" | "FEMALE" | null;
  profile_image_url: string | null;
  salary_type: "MONTHLY" | "COMMISSION" | "HYBRID";
  status: "ACTIVE" | "INACTIVE";
  branch_id: string | null;
  branch_name: string | null;
  created_at: string;
}

export interface LecturerDetailResponse {
  status: string;
  message: string | null;
  data: {
    profile: LecturerProfile;
    assignedCourses: unknown[];
    assignedBatches: unknown[];
    salaryHistory: unknown[];
    commissionHistory: unknown[];
  };
}

export function useGetLecturerById(id: string | null) {
  return useQuery({
    queryKey: [queryKeys.lecturers, id],
    queryFn: async () => {
      if (!id) return null;

      const response = await api.get<LecturerDetailResponse>(
        API_ENDPOINTS.lecturers.GET_BY_ID(id)
      );

      return response.data.data.profile;
    },
    enabled: !!id,
  });
}
