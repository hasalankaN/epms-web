import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";
import type { NotificationsListResponse } from "@/types/notifications";

export interface GetScheduledNotificationsParams {
  page?: number;
  size?: number;
  scheduledOnFrom?: string;
  scheduledOnTo?: string;
  scheduledForFrom?: string;
  scheduledForTo?: string;
  channels?: string;
  targetType?: string;
}

export function useGetScheduledNotifications(params: GetScheduledNotificationsParams) {
  return useQuery<NotificationsListResponse>({
    queryKey: [queryKeys.notificationsScheduled, params],
    queryFn: async () => {
      const p: Record<string, any> = { page: params.page ?? 1, size: params.size ?? 10 };

      if (params.scheduledOnFrom) p.scheduledOnFrom = params.scheduledOnFrom;
      if (params.scheduledOnTo) p.scheduledOnTo = params.scheduledOnTo;
      if (params.scheduledForFrom) p.scheduledForFrom = params.scheduledForFrom;
      if (params.scheduledForTo) p.scheduledForTo = params.scheduledForTo;
      if (params.channels) p.channels = params.channels;
      if (params.targetType) p.targetType = params.targetType;

      const { data } = await api.get(API_ENDPOINTS.notifications.GET_SCHEDULED, { params: p });

      
return data.data;
    },
  });
}
