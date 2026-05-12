import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";
import type { EnrollmentSummary } from "@/types/enroll";

export function useGetEnrollmentSummary() {
  return useQuery<EnrollmentSummary>({
    queryKey: [queryKeys.enrollments, "summary"],
    queryFn: async () => {
      const response = await api.get(API_ENDPOINTS.enrollments.GET_SUMMARY);

      return response.data.data;
    },
  });
}
