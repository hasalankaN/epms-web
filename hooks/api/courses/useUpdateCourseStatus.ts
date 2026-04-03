import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

export type CourseStatus = "ACTIVE" | "INACTIVE" | "DRAFT";

export interface UpdateCourseStatusPayload {
  status: CourseStatus;
}

/**
 * Hook to update only the status of a specific course.
 * @param id Course ID
 */
export function useUpdateCourseStatus(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateCourseStatusPayload) => {
      const { data } = await api.patch(API_ENDPOINTS.courses.UPDATE_STATUS(id), payload);

      return data;
    },
    onSuccess: () => {
      // Invalidate the courses list and specific course detail cache
      queryClient.invalidateQueries({ queryKey: [queryKeys.courses] });
      toast.success("Course status updated successfully.");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update course status.");
    },
  });
}
