import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

export function useDeleteScheduledNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(API_ENDPOINTS.notifications.DELETE_SCHEDULED(id));

      
return data.data;
    },
    onSuccess: () => {
      toast.success("Scheduled notification deleted.");
      queryClient.invalidateQueries({ queryKey: [queryKeys.notificationsScheduled] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete notification.");
    },
  });
}
