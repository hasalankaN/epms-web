import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import type { CommonResponseDataType } from "@/types/common";

export interface ReferralStudent {
  id: string;
  student_id: string;
  student_name: string;
  district: string;
  status: string;
  students_referred: number;
  products: number;
  commission_total: string;
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

export const useGetReferralStudents = (params?: { page?: number; size?: number; search?: string }) => {
  return useQuery({
    queryKey: ["referral-students", params],
    queryFn: async () => {
      const { data } = await api.get<CommonResponseDataType<PaginatedResponse<ReferralStudent>>>(
        API_ENDPOINTS.referrals.STUDENTS,
        { params: { page: params?.page || 1, size: params?.size || 10, search: params?.search || undefined } }
      );

      return data.data;
    },
  });
};
