import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";
import type { ResponseLogsListResponse } from "@/types/notifications";

export interface GetResponseLogsParams {
  page?: number;
  size?: number;
  studentName?: string;
  receiverName?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

export function useGetResponseLogs(params: GetResponseLogsParams) {
  return useQuery<ResponseLogsListResponse>({
    queryKey: [queryKeys.notificationsResponseLogs, params],
    queryFn: async () => {
      const p: Record<string, any> = { page: params.page ?? 1, size: params.size ?? 10 };

      if (params.studentName) p.studentName = params.studentName;
      if (params.receiverName) p.receiverName = params.receiverName;
      if (params.status) p.status = params.status;
      if (params.dateFrom) p.dateFrom = params.dateFrom;
      if (params.dateTo) p.dateTo = params.dateTo;

      const { data } = await api.get(API_ENDPOINTS.notifications.GET_RESPONSE_LOGS, { params: p });

      
return data.data;
    },
  });
}
