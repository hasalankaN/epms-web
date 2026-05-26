import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

export interface TaskGuideline {
  id: string;
  file_url: string;
  file_name: string;
  file_type: string;
}

export interface TaskAssignmentBatch {
  id: string;
  name: string;
}

export interface TaskAssignmentStaff {
  id: string;
  name: string;
}

export interface TaskSubmissionFile {
  file_url: string;
  file_name: string;
}

export interface TaskSubmission {
  student_id?: string;
  student_name?: string;
  staff_id?: string;
  staff_name?: string;
  submission_id?: string;
  submitted_at: string | null;
  status: "PENDING" | "SUBMITTED" | "SUBMITTED_LATE" | "GRADED" | "COMPLETED";
  score: string | null;
  feedback: string | null;
  files: TaskSubmissionFile[];
}

export interface TaskDetail {
  id: string;
  name: string;
  description: string;
  type: "BATCH" | "STAFF";
  due_date: string;
  status: "PENDING" | "COMPLETED";
  created_at: string;
  expected_submission_count: number;
  creator_name: string;
  assigned_batches: TaskAssignmentBatch[];
  assigned_staff: TaskAssignmentStaff[];
  completed_count: number;
  total_pending: number;
  submissions: TaskSubmission[];
}

export function useGetTaskDetail(taskId: string) {
  return useQuery<TaskDetail>({
    queryKey: [queryKeys.tasks, taskId],
    queryFn: async () => {
      const response = await api.get(
        API_ENDPOINTS.tasks.GET_BY_ID(taskId)
      );
      return response.data.data;
    },
    enabled: !!taskId,
  });
}
