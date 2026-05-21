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
  salary_type: "MONTHLY" | "PERCENTAGE_FROM_BATCH_DEPOSITS" | "COURSE_WISE_PAYMENTS" | "BATCH_WISE_PAYMENTS";
  salary_due_day?: string | null;
  salary_due_frequency?: string | null;
  status: "ACTIVE" | "INACTIVE";
  branch_id: string | null;
  branch_name: string | null;
  created_at: string;
}

export interface LecturerAssignedCourse {
  id: string;
  name: string;
  lesson_duration: string | null;
  created_at: string;
  category_name: string | null;
  base_price: string;
  enrollment_count: number;
}

export interface LecturerAssignedBatch {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  created_at: string;
  base_price: string;
  enrollment_count: number;
}

export interface LecturerSalaryPayment {
  id: string;
  description: string;
  source_type: string;
  source_id: string | null;
  amount: string;
  period: string | null;
  status: "PENDING" | "PAID";
  paid_date: string | null;
  receipt_url: string | null;
  created_at: string;
}

export interface LecturerDetail {
  profile: LecturerProfile;
  assignedCourses: LecturerAssignedCourse[];
  assignedBatches: LecturerAssignedBatch[];
  salaryHistory: LecturerSalaryPayment[];
  commissionHistory: unknown[];
}

export function useGetLecturerById(id: string | null) {
  return useQuery<LecturerDetail | null>({
    queryKey: [queryKeys.lecturers, id],
    queryFn: async () => {
      if (!id) return null;
      const response = await api.get(API_ENDPOINTS.lecturers.GET_BY_ID(id));

      
return response.data.data as LecturerDetail;
    },
    enabled: !!id,
  });
}
