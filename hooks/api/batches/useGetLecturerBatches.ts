import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import type { CommonResponseDataType } from "@/types/common";

export interface Batch {
  id: string;
  custom_id: string;
  name: string;
  cover_image_url: string | null;
  category: string;
  type: string;
  status: string;
  branch_id: string;
  branch_name: string;
  start_date: string;
  end_date: string;
  is_draft: boolean;
  tier_count: number;
  language: string;
  lesson_duration: string;
  student_count: number;
  has_assignment: boolean;
  is_paid: boolean;
  lecturer_id: string;
  lecturer_email: string;
  lecturer_name: string | null;
  created_at: string;
}

interface PaginatedResponse<T> {
  results: T[];
  totalResults: number;
  page: number;
  size: number;
  totalPages: number;
  isFirstPage: boolean;
  isLastPage: boolean;
}

export const useGetLecturerBatches = (lecturerId: string, params?: any) => {
  return useQuery({
    queryKey: ["lecturer-batches", lecturerId, params],
    queryFn: async () => {
      const { data } = await api.get<CommonResponseDataType<PaginatedResponse<Batch>>>(
        API_ENDPOINTS.batches.GET_ALL,
        {
          params: {
            ...params,
            lecturer_id: lecturerId,
            orderBy: params?.orderBy || "createdAt",
            order: params?.order || "desc",
            page: params?.page || 1,
            size: params?.size || 50,
          },
        }
      );

      return data.data;
    },
    enabled: !!lecturerId,
  });
};
