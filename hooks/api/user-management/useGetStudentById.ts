import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";
import type { AdminStudentDetailResponse } from "@/types/user-management";

export interface StudentDetailParams {
  courses_page?: number;
  courses_size?: number;
  batches_page?: number;
  batches_size?: number;
  products_page?: number;
  products_size?: number;
  commissions_page?: number;
  commissions_size?: number;
  payments_page?: number;
  payments_size?: number;
  installments_page?: number;
  installments_size?: number;
}

export function useGetStudentById(id: string | null, params: StudentDetailParams = {}) {
  // Clean params
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null)
  );

  return useQuery<AdminStudentDetailResponse>({
    queryKey: [queryKeys.students, id, cleanParams],
    queryFn: async () => {
      if (!id) throw new Error("Student ID is required");

      const response = await api.get(API_ENDPOINTS.adminStudents.GET_BY_ID(id), {
        params: cleanParams,
      });

      return response.data.data;
    },
    enabled: !!id,
  });
}
