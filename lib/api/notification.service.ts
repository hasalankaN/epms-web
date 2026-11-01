import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { normalizeListResponse, normalizeMutationResponse } from "@/lib/api/responseNormalizer";
import type { NotificationDataType } from "@/types/notifications";

function mapNotification(row: any): NotificationDataType {
  return {
    id: String(row.notification_id || row.id || row._id),
    title: row.title || row.subject || "Notification",
    message: row.message || row.body || row.content || "",
    type: (row.type || row.category || "general") as any,
    createdAt: row.created_at || row.createdAt || row.date || "",
    isRead: Boolean(row.is_read ?? row.isRead ?? false),
  };
}

export const notificationService = {
  /**
   * GET /me/notifications  — Employee / Supervisor / HR own notifications
   */
  getMyNotifications: async (): Promise<NotificationDataType[]> => {
    const res = await api.get(API_ENDPOINTS.me.NOTIFICATIONS);
    const list = normalizeListResponse<any>(res.data);
    return list.items.map(mapNotification);
  },

  /**
   * PATCH /me/notifications/:id/read
   */
  markRead: async (id: string): Promise<void> => {
    await api.patch(API_ENDPOINTS.me.NOTIFICATION_READ(id));
  },

  /**
   * PATCH /me/notifications/read-all
   */
  markAllRead: async (): Promise<void> => {
    await api.patch(API_ENDPOINTS.me.NOTIFICATIONS_READ_ALL);
  },

  /**
   * GET /hr/notifications
   */
  getHrNotifications: async (): Promise<NotificationDataType[]> => {
    const res = await api.get(API_ENDPOINTS.hr.NOTIFICATIONS);
    const list = normalizeListResponse<any>(res.data);
    return list.items.map(mapNotification);
  },

  /**
   * POST /hr/notifications  — HR send notification to employee(s)
   */
  sendHrNotification: async (payload: {
    recipientIds?: string[];
    title: string;
    message: string;
    type?: string;
  }): Promise<{ success: boolean; message: string }> => {
    const res = await api.post(API_ENDPOINTS.hr.NOTIFICATIONS, {
      recipient_ids: payload.recipientIds,
      title: payload.title,
      message: payload.message,
      type: payload.type || "general",
    });
    return normalizeMutationResponse(res.data, "Notification sent");
  },

  /**
   * PATCH /hr/notifications/:id
   */
  markHrNotification: async (id: string): Promise<void> => {
    await api.patch(API_ENDPOINTS.hr.NOTIFICATION_DETAIL(id));
  },

  /**
   * DELETE /hr/notifications/:id
   */
  deleteHrNotification: async (id: string): Promise<void> => {
    await api.delete(API_ENDPOINTS.hr.NOTIFICATION_DETAIL(id));
  },

  /**
   * GET /admin/notifications
   */
  getAdminNotifications: async (): Promise<NotificationDataType[]> => {
    const res = await api.get(API_ENDPOINTS.adminEpms.NOTIFICATIONS);
    const list = normalizeListResponse<any>(res.data);
    return list.items.map(mapNotification);
  },

  /**
   * GET /notifications  — Global/shared notifications
   */
  getNotifications: async (): Promise<NotificationDataType[]> => {
    const res = await api.get(API_ENDPOINTS.notifications.GET_ALL);
    const list = normalizeListResponse<any>(res.data);
    return list.items.map(mapNotification);
  },
};

