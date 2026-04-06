import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";
import type { EnquiryDashboardData } from "@/types/inquiry";

export function useGetEnquiryDashboard() {
  return useQuery({
    queryKey: [queryKeys.enquiries, "dashboard"],
    queryFn: async () => {
      const response = await api.get<{ data: EnquiryDashboardData }>(
        API_ENDPOINTS.enquiries.GET_DASHBOARD
      );

      return response.data.data;
    },
  });
}
