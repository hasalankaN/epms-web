import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

export interface LecturerSubmissionItem {
  id: string;
  assignment_id: string;
  student_id: string;
  student_name: string;
  student_avatar?: string;
  course_name: string | null;
  batch_name: string | null;
  lesson_title: string;
  type: string;
  status: "PENDING" | "REVIEWED";
  submitted_date: string;
  file_url: string;
  file_type: string;
  feedback_date?: string;
  grade?: string;
  feedback?: string;
}

export interface PaginatedSubmissionsResponse {
  message: string;
  data: LecturerSubmissionItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}

export function useGetLecturerSubmissions(params?: { 
  status: "PENDING" | "REVIEWED";
  page?: number; 
  limit?: number; 
  search?: string; 
  type?: string;
  source_id?: string;
  start_date?: string;
  end_date?: string;
}) {
  return useQuery({
    queryKey: ["lecturer-submissions", params],
    queryFn: async () => {
      const response = await api.get<{ data: PaginatedSubmissionsResponse }>(
        "/api/v1/lecturer/assignments/global/submissions",
        { params }
      );
      return response.data.data;
    },
    enabled: !!params?.status, // ensure status is always provided
  });
}
