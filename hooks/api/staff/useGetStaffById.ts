import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

export interface StaffProfile {
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
  salary_type: "MONTHLY" | "PERCENTAGE_FROM_BATCH_DEPOSITS" | "BATCH_OR_COURSE_WISE_PAYMENT";
  salary_due_day?: string;
  salary_due_frequency?: string;
  is_branch_manager: boolean;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  branch_id: string | null;
  branch_name: string | null;
  created_at: string;
}

export interface Privilege {
  id: string;
  staff_user_id: string;
  privilege_code: string;
  granted_at: string;
  granted_by: string;
}

export interface StaffDetailResponse {
  status: string;
  message: string | null;
  data: {
    profile: StaffProfile;
    privileges: Privilege[];
    commissionsSummary: {
      total_commissions: string;
      amount_paid: string;
      balance_payment: string;
    };
    commissionHistory: unknown[];
    enquiries: unknown[];
  };
}

export function useGetStaffById(id: string | null) {
  return useQuery({
    queryKey: [queryKeys.staff, id],
    queryFn: async () => {
      if (!id) return null;

      const response = await api.get<StaffDetailResponse>(
        API_ENDPOINTS.staff.GET_BY_ID(id)
      );

      return response.data.data;
    },
    enabled: !!id,
  });
}
