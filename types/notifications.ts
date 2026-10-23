export type NotificationType =
  | "leave"
  | "task"
  | "training"
  | "salary"
  | "profile"
  | "system"
  | "general";

export type NotificationDataType = {
  id: string;
  title: string;
  message: string;
  type?: NotificationType;
  createdAt?: string;
  isRead?: boolean;
};
