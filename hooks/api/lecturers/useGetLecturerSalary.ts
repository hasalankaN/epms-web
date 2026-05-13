import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
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
        "/api/v1/lecturer/profile/salary"
      );
      return data.data;
    },
  });
};
