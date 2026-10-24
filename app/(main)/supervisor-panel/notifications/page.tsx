import React from "react";

import type { NotificationDataType } from "@/types/notifications";
import NotificationsList from "@/components/common/notifications/NotificationsList";

const MOCK_NOTIFICATIONS: NotificationDataType[] = [
  {
    id: "1",
    title: "Task overdue",
    message: "Sprint report by Mark T. is 2 days overdue.",
    type: "task",
    createdAt: "30 m ago",
    isRead: false,
  },
  {
    id: "2",
    title: "Leave request",
    message: "Tom R. has requested 3 days of annual leave starting Oct 28.",
    type: "leave",
    createdAt: "3 h ago",
    isRead: false,
  },
  {
    id: "3",
    title: "Training completed",
    message: "5 team members completed the Agile Fundamentals training.",
    type: "training",
    createdAt: "Yesterday",
    isRead: true,
  },
  {
    id: "4",
    title: "Performance review due",
    message: "Q3 performance reviews are due by Octomber 31.",
    type: "general",
    createdAt: "Oct 12",
    isRead: true,
  },
];

export default function SupervisorNotificationsPage() {
  return (
    <NotificationsList
      initialNotifications={MOCK_NOTIFICATIONS}
      subtitle="Team tasks, leave requests, and performance alerts."
    />
  );
}
