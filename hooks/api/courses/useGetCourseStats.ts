import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";
import type { CourseStatsData } from "@/types/course";

export function useGetCourseStats() {
  return useQuery({
    queryKey: [queryKeys.courses, "stats"],
    queryFn: async () => {
      const response = await api.get<{ data: CourseStatsData }>(
        API_ENDPOINTS.courses.GET_STATS
      );

      return response.data.data;
    },
  });
}
