import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import type { CommonResponseDataType } from "@/types/common";

export interface DashboardCourseOrBatch {
  id: string;
  name: string;
  categoryName?: string;
  startDate: string;
  enrollmentCount: number;
  completionPercentage?: number;
}

export interface LecturerDashboardData {
  courses: DashboardCourseOrBatch[];
  batches: DashboardCourseOrBatch[];
  // Include other fields if needed, like pendingAssignments, financialSummary, etc.
}

export const useGetLecturerDashboard = () => {
  return useQuery({
    queryKey: ["lecturer-dashboard"],
    queryFn: async () => {
      const { data } = await api.get<CommonResponseDataType<LecturerDashboardData>>(
        "/api/v1/lecturer/dashboard"
      );
      return data.data;
    },
  });
};
