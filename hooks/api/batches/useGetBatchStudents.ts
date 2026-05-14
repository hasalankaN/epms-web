import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";
import type { StudentDataType } from "@/types/student";

// ==================== Types ====================

export interface BatchStudentsResponse {
  items: StudentDataType[];
  total: number;
  page: number;
  size: number;
  total_pages: number;
}

interface ApiBatchStudentsResponse {
  status: string;
  message: string | null;
  data: BatchStudentsResponse;
}

// ==================== Hook ====================

export interface UseGetBatchStudentsParams {
  batchId: string | null;
  page?: number;
  size?: number;
  search?: string;
}

export function useGetBatchStudents({
  batchId,
  page = 1,
  size = 10,
  search,
}: UseGetBatchStudentsParams) {
  return useQuery({
    queryKey: [queryKeys.batchStudents, batchId, page, size, search],
    queryFn: async () => {
      if (!batchId) return null;

      const params = new URLSearchParams({
        page: String(page),
        size: String(size),
      });

      if (search) {
        params.set("search", search);
      }

      const response = await api.get<ApiBatchStudentsResponse>(
        `${API_ENDPOINTS.batches.GET_STUDENTS(batchId)}?${params.toString()}`,
      );

      return response.data.data;
    },
    enabled: !!batchId,
  });
}
