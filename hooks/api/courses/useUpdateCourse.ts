import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

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
  team_value?: number;
}

export interface UpdateCoursePayload {
  general_details: {
    name: string;
    short_description?: string;
    long_description: string;
    cover_image_url?: string;
    intro_video_url?: string;
    course_type?: string;
    level?: string;
    language?: string;
    lecturer_id?: string;
    start_date?: string;
    end_date?: string;
    lesson_duration_hours?: number;
    staff_member_ids: string[];
    certificate_ids: string[];
    status?: string;
    category_id: string;
    has_assessment: boolean;
    hierarchy_type?: string;
    batch_id?: string;
  };
  fee_details: {
    pricing_option: "Paid" | "Free";
    fees?: CourseFeeItemDto[];
    installments_enabled: boolean;
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

export interface UpdateCourseResponse {
  id: string;
  course_id: string;
}

export function useUpdateCourse(courseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateCoursePayload): Promise<UpdateCourseResponse> => {
      const response = await api.patch(API_ENDPOINTS.courses.UPDATE(courseId), payload);

      return response.data?.data;
    },
    onSuccess: () => {
      // Invalidate both the list and the specific course detail cache
      queryClient.invalidateQueries({ queryKey: [queryKeys.courses] });
      toast.success("Course updated successfully.");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update course.");
    },
  });
}
