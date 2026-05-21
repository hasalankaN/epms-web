import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import type { CommonResponseDataType } from "@/types/common";

export interface DashboardCourseOrBatch {
  id: string;
  name: string;
  categoryName?: string;
  startDate: string;
  endDate?: string;
  enrollmentCount: number;
  completionPercentage?: number;
}

export interface LecturerDashboardData {
  courses: DashboardCourseOrBatch[];
  batches: DashboardCourseOrBatch[];
  assignmentSummary: {
    courseAssignments: number;
    batchAssignments: number;
  };
  financialSummary: {
    estimated: string;
    accumulated: string;
    pending: string;
  };
  zoomToday: any[];
  zoomUpcoming: any[];
}

export const useGetLecturerDashboard = () => {
  return useQuery({
    queryKey: ["lecturer-dashboard"],
    queryFn: async () => {
      const { data } = await api.get<CommonResponseDataType<LecturerDashboardData>>(
        API_ENDPOINTS.lecturer.DASHBOARD
      );

      return data.data;
    },
  });
};
