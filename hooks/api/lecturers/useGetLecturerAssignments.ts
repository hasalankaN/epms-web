import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

export interface LecturerAssignmentCourse {
  id: string;
  name: string;
  courseCategory: string;
  type: string;
  enrollmentCount: number;
}

export interface LecturerAssignmentBatch {
  id: string;
  batchName: string;
  batchCategory: string;
  type: string;
  enrollmentCount: number;
}

export interface LecturerAssignmentsResponse {
  courses: LecturerAssignmentCourse[];
  batches: LecturerAssignmentBatch[];
}

export function useGetLecturerAssignments() {
  return useQuery<LecturerAssignmentsResponse>({
    queryKey: [queryKeys.lecturer, "assignments"],
    queryFn: async () => {
      const response = await api.get(API_ENDPOINTS.lecturer.ASSIGNMENTS);
      return response.data.data;
    },
  });
}
