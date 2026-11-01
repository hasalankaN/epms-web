import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { notificationService } from "@/lib/api/notification.service";
import { queryKeys } from "@/lib/constants/queryKeys";

/** Employee / Supervisor / HR — own /me/notifications */
export const useMyNotificationsQuery = () => {
  return useQuery({
    queryKey: [queryKeys.notifications, "me"],
    queryFn: () => notificationService.getMyNotifications(),
    staleTime: 30_000,
  });
};

export const useMarkReadMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationService.markRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.notifications] });
    },
    onError: (err: any) => toast.error(err?.message || "Failed to mark notification."),
  });
};

export const useMarkAllReadMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => notificationService.markAllRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.notifications] });
      toast.success("All notifications marked as read.");
    },
    onError: (err: any) => toast.error(err?.message || "Failed to mark all notifications."),
  });
};

/** HR notifications */
export const useHrNotificationsQuery = () => {
  return useQuery({
    queryKey: [queryKeys.notifications, "hr"],
    queryFn: () => notificationService.getHrNotifications(),
    staleTime: 30_000,
  });
};

export const useSendHrNotificationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { recipientIds?: string[]; title: string; message: string; type?: string }) =>
      notificationService.sendHrNotification(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.notifications, "hr"] });
      toast.success("Notification sent successfully!");
    },
    onError: (err: any) => toast.error(err?.message || "Failed to send notification."),
  });
};

export const useMarkHrNotificationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationService.markHrNotification(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [queryKeys.notifications, "hr"] }),
    onError: (err: any) => toast.error(err?.message || "Failed to update notification."),
  });
};

export const useDeleteHrNotificationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationService.deleteHrNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.notifications, "hr"] });
      toast.success("Notification deleted.");
    },
    onError: (err: any) => toast.error(err?.message || "Failed to delete notification."),
  });
};

/** Admin notifications */
export const useAdminNotificationsQuery = () => {
  return useQuery({
    queryKey: [queryKeys.notifications, "admin"],
    queryFn: () => notificationService.getAdminNotifications(),
    staleTime: 30_000,
  });
};

