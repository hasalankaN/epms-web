import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

// ==================== Payload Types (match API contract exactly) ====================

interface CourseFeeItemDto {
  amount: number;
  duration_years: number;
}

interface CourseInstallmentPlanDto {
  description: string;
  amount: number;
}

interface CommissionEntryDto {
  type: "Percentage" | "Fixed";
  value: number;
  team_value: number;
}

export interface CreateCoursePayload {
  general_details: {
    name: string;
    staff_members: string[];
    has_assessment: boolean;
    course_type?: string;
    start_date?: string;
    end_date?: string;
    certificates: string[];
    category_id: string;
    lecturer_id: string;
    level: string;
    language: string;
    lesson_duration_hours?: number;
    hierarchy_type: string;
    batch_id?: string;
    short_description?: string;
    long_description: string;
    cover_image_url?: string;
    intro_video_url?: string;
  };
  fee_details: {
    pricing_option: "Paid" | "Free";
    fees?: CourseFeeItemDto[];
    installments_enabled?: boolean;
    number_of_installments?: number;
    installment_plans?: CourseInstallmentPlanDto[];
  };
  commission_details: {
    referral: CommissionEntryDto;
    lecturer: CommissionEntryDto;
    staff: CommissionEntryDto;
    branch_staff: CommissionEntryDto;
  };
}

export interface CreateCourseResponse {
  id: string;
  course_id: string;
}

export function useCreateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateCoursePayload): Promise<CreateCourseResponse> => {
      const response = await api.post(API_ENDPOINTS.courses.CREATE, payload);

      return response.data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.courses] });
      toast.success("Course created successfully.");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create course.");
    },
  });
}
