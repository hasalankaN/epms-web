import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

export interface StaffAssignedCourse {
  course_id: string;
  course_created_at: string;
  category_name: string | null;
  course_name: string;
  lesson_duration: string | null;
  base_price: string;
  enrollment_count: number;
}

export function useGetStaffAssignedCourses(staffId: string | null) {
  return useQuery<StaffAssignedCourse[]>({
    queryKey: [queryKeys.staff, staffId, "courses"],
    queryFn: async () => {
      const res = await api.get(API_ENDPOINTS.staff.GET_ASSIGNED_COURSES(staffId!));
     
      return res.data.data ?? [];
    },
    enabled: !!staffId,
  });
}
