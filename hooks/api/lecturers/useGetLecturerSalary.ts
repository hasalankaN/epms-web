import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import type { CommonResponseDataType } from "@/types/common";

export interface LecturerSalary {
  salaryType: string;
  amount: string;
  commissionRate?: string;
}

export const useGetLecturerSalary = () => {
  return useQuery({
    queryKey: ["lecturer-salary"],
    queryFn: async () => {
      const { data } = await api.get<CommonResponseDataType<LecturerSalary>>(
        API_ENDPOINTS.lecturer.SALARY
      );

      return data.data;
    },
  });
};
