import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";
import type { CreateNotificationDto } from "@/types/notifications";

export function useCreateNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: CreateNotificationDto) => {
      const { data } = await api.post(API_ENDPOINTS.notifications.CREATE, dto);

      
return data.data;
    },
    onSuccess: (_data, variables) => {
      const msg = variables.scheduledAt ? "Notification scheduled." : "Notification sent.";

      toast.success(msg);
      queryClient.invalidateQueries({ queryKey: [queryKeys.notificationsSent] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.notificationsScheduled] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to send notification.");
    },
  });
}
