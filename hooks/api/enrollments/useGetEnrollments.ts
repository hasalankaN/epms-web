import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";
import type { GetEnrollmentsParams, GetEnrollmentsResponse } from "@/types/enroll";

export function useGetEnrollments(params: GetEnrollmentsParams) {
  // Clean params - only include defined, non-empty values
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== "")
  );

  return useQuery<GetEnrollmentsResponse>({
    queryKey: [queryKeys.enrollments, cleanParams],
    queryFn: async () => {
      const apiParams: Record<string, any> = {
        page: params.page || 1,
        size: params.size || 20,
        orderBy: params.orderBy || "createdAt",
        order: params.order || "desc",
      };

      // Add optional params if they have values
      if (params.search) apiParams.search = params.search;
      if (params.district) apiParams.district = params.district;
      if (params.gender) apiParams.gender = params.gender;
      if (params.batch_or_course_id) apiParams.batch_or_course_id = params.batch_or_course_id;
      if (params.enrollment_type) apiParams.enrollment_type = params.enrollment_type;
      if (params.lifecycle_status) apiParams.lifecycle_status = params.lifecycle_status;
      if (params.date_from) apiParams.date_from = params.date_from;
      if (params.date_to) apiParams.date_to = params.date_to;
      if (params.enrollment_target) apiParams.enrollment_target = params.enrollment_target;

      const response = await api.get(API_ENDPOINTS.enrollments.GET_ALL, {
        params: apiParams,
      });

      return response.data.data;
    },
  });
}
