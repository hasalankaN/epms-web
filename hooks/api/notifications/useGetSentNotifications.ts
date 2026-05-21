import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";
import type { NotificationsListResponse } from "@/types/notifications";

export interface GetSentNotificationsParams {
  page?: number;
  size?: number;
  dateFrom?: string;
  dateTo?: string;
  channels?: string;
  targetType?: string;
}

export function useGetSentNotifications(params: GetSentNotificationsParams) {
  return useQuery<NotificationsListResponse>({
    queryKey: [queryKeys.notificationsSent, params],
    queryFn: async () => {
      const p: Record<string, any> = { page: params.page ?? 1, size: params.size ?? 10 };

      if (params.dateFrom) p.dateFrom = params.dateFrom;
      if (params.dateTo) p.dateTo = params.dateTo;
      if (params.channels) p.channels = params.channels;
      if (params.targetType) p.targetType = params.targetType;

      const { data } = await api.get(API_ENDPOINTS.notifications.GET_SENT, { params: p });

      
return data.data;
    },
  });
}
