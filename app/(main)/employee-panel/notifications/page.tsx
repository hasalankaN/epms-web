import React from "react";

import type { NotificationDataType } from "@/types/notifications";
import NotificationsList from "@/components/common/notifications/NotificationsList";


const MOCK_NOTIFICATIONS: NotificationDataType[] = [
  {
    id: "1",
    title: "Leave approved",
    message: "Your casual leave for Oct 28 to Oct 29 was approved.",
    type: "leave",
    createdAt: "2 h ago",
    isRead: false,
  },
  {
    id: "2",
    title: "New task assigned",
    message: "Prepare sprint demo slides · due today.",
    type: "task",
    createdAt: "Yesterday",
    isRead: false,
  },
  {
    id: "3",
    title: "Training reminder",
    message: "Secure coding workshop starts Wed at 10:00 AM.",
    type: "training",
    createdAt: "Yesterday",
    isRead: false,
  },
  {
    id: "4",
    title: "Payslip ready",
    message: "Your September payslip is available.",
    type: "salary",
    createdAt: "Sep 30",
    isRead: true,
  },
  {
    id: "5",
    title: "Profile update approved",
    message: "HR approved your address change.",
    type: "profile",
    createdAt: "Sep 22",
    isRead: true,
  },
];

export default function EmployeeNotificationsPage() {
  return (
    <NotificationsList
      initialNotifications={MOCK_NOTIFICATIONS}
      subtitle="Updates about leave, tasks, training and pay."
    />
  );
}
