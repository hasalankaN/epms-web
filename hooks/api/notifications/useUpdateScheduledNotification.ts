import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";
import type { UpdateNotificationDto } from "@/types/notifications";

export function useUpdateScheduledNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, dto }: { id: string; dto: UpdateNotificationDto }) => {
      const { data } = await api.patch(API_ENDPOINTS.notifications.UPDATE_SCHEDULED(id), dto);

      
return data.data;
    },
    onSuccess: () => {
      toast.success("Notification updated.");
      queryClient.invalidateQueries({ queryKey: [queryKeys.notificationsScheduled] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update notification.");
    },
  });
}
