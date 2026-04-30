// In-app user notification (bell icon, userNotifications table)
export interface NotificationDataType {
  id: string;
  user_id: string;
  title: string;
  body: string;
  is_read: boolean;
  data: Record<string, unknown> | null;
  created_at: string;
}

export type NotificationChannel = 'PUSH' | 'EMAIL' | 'SMS';
export type NotificationTargetType = 'ALL' | 'BATCH' | 'ROLE' | 'USER_IDS' | 'COURSE';
export type ResponseLogStatus = 'PENDING' | 'RESPONDED' | 'OVERDUE';

export interface NotificationSchedule {
  id: string;
  title: string;
  body: string;
  channels: NotificationChannel[];
  target_type: NotificationTargetType;
  target_ids: string[] | null;
  scheduled_at: string | null;
  sent_at: string | null;
  created_by: string;
  created_at: string;
}

export interface ResponseLog {
  id: string;
  room_id: string;
  student_id: string;
  student_name: string;
  receiver_id: string;
  receiver_name: string;
  sent_at: string;
  responded_at: string | null;
  status: ResponseLogStatus;
  duration: string | null;
}

export interface NotificationsListResponse {
  data: NotificationSchedule[];
  total: number;
  page: number;
  size: number;
}

export interface ResponseLogsListResponse {
  data: ResponseLog[];
  total: number;
  page: number;
  size: number;
}

export interface CreateNotificationDto {
  title: string;
  body: string;
  channels: NotificationChannel[];
  targetType: NotificationTargetType;
  targetIds?: string[];
  scheduledAt?: string;
}

export type UpdateNotificationDto = Partial<CreateNotificationDto>;
