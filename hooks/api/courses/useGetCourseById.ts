import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

// ==================== API Response Types ====================

export interface ApiStaffMember {
  id: string;
  full_name: string | null;
  email: string;
}

export interface ApiLecturer {
  id: string;
  full_name: string | null;
  email: string;
}

export interface ApiCertificateTemplate {
  id: string;
  name: string;
  price: string;
  template_file_url: string;
  status: string;
}

export interface ApiCourseGeneralDetails {
  name: string;
  staff_members: ApiStaffMember[];
  has_assessment: boolean;
  course_type: string | null;
  start_date: string | null;
  end_date: string | null;
  certificates: ApiCertificateTemplate[];
  category_id: string;
  lecturer_id: string;
  lecturer: ApiLecturer | null;
  level: string;
  language: string;
  lesson_duration_hours: number | null;
  hierarchy_type: string;
  batch_id: string | null;
  batch_name: string | null;
  short_description: string | null;
  long_description: string;
  cover_image_url: string | null;
  intro_video_url: string | null;
}

export interface ApiCourseFee {
  amount: number;
  duration_years: number;
}

export interface ApiCourseInstallmentPlan {
  description: string;
  amount: number;
}

export interface ApiCourseFeeDetails {
  pricing_option: "Paid" | "Free";
  fees: ApiCourseFee[];
  installments_enabled: boolean;
  number_of_installments: number | null;
  installment_plans: ApiCourseInstallmentPlan[];
}

export interface ApiCourseCommissionEntry {
  type: "Percentage" | "Fixed";
  value: number;
  team_value?: number;
}

export interface ApiCourseCommissionDetails {
  referral: ApiCourseCommissionEntry;
  lecturer: ApiCourseCommissionEntry;
  staff: ApiCourseCommissionEntry;
  branch_staff: ApiCourseCommissionEntry;
}

export interface ApiCourseDetail {
  id: string;
  general_details: ApiCourseGeneralDetails;
  fee_details: ApiCourseFeeDetails;
  commission_details: ApiCourseCommissionDetails;
  status: string;
  created_at: string;
  updated_at: string;
}

interface ApiCourseDetailResponse {
  status: string;
  message: string | null;
  data: {
    status?: string;
    message?: string | null;
    data: ApiCourseDetail;
  };
}


// ==================== Hook ====================

export function useGetCourseById(id: string | null) {
  return useQuery({
    queryKey: [queryKeys.courses, id],
    queryFn: async () => {
      if (!id) return null;

      const response = await api.get<ApiCourseDetailResponse>(
        API_ENDPOINTS.courses.GET_BY_ID(id)
      );

      // Handle the double-nested data object from the backend response
      const nestedData = response.data.data;

      return nestedData.data ? nestedData.data : (nestedData as unknown as ApiCourseDetail);
    },
    enabled: !!id,
  });
}
