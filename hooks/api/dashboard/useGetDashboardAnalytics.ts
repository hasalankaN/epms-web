import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

export interface AnalyticsChartItem {
  id: string | null;
  name: string;
  value: number;
}

export interface DashboardAnalyticsData {
  topBatches: AnalyticsChartItem[];
  topCourses: AnalyticsChartItem[];
}

export function useGetDashboardAnalytics(params?: {
  from?: string;
  to?: string;
  limit?: number;
}) {
  return useQuery<DashboardAnalyticsData>({
    queryKey: [queryKeys.dashboardAnalytics, params],
    queryFn: async () => {
      const res = await api.get<{ data: DashboardAnalyticsData }>(
        API_ENDPOINTS.dashboard.ANALYTICS,
        { params },
      );

      return res.data.data;
    },
    staleTime: 300_000,
  });
}
