import React from "react";
import type { NotificationDataType } from "@/types/notifications";
import NotificationsList from "@/components/common/notifications/NotificationsList";

// TODO: Replace with real API call  →  const data = await fetchAdminNotifications();
const MOCK_NOTIFICATIONS: NotificationDataType[] = [
  {
    id: "1",
    title: "New account request",
    message: "John Doe has submitted an account registration request pending approval.",
    type: "profile",
    createdAt: "2 h ago",
    isRead: false,
  },
  {
    id: "2",
    title: "System settings updated",
    message: "Password policy has been changed by a super-admin.",
    type: "system",
    createdAt: "Yesterday",
    isRead: false,
  },
  {
    id: "3",
    title: "Department created",
    message: "A new department 'Product Design' was successfully created.",
    type: "general",
    createdAt: "Yesterday",
    isRead: false,
  },
  {
    id: "4",
    title: "User role updated",
    message: "Sarah K. was promoted from Employee to Supervisor.",
    type: "profile",
    createdAt: "Oct 15",
    isRead: true,
  },
  {
    id: "5",
    title: "Payroll processed",
    message: "October payroll has been processed for all departments.",
    type: "salary",
    createdAt: "Oct 10",
    isRead: true,
  },
];

export default function AdminNotificationsPage() {
  return (
    <NotificationsList
      initialNotifications={MOCK_NOTIFICATIONS}
      subtitle="Admin alerts, system events, and account activity."
    />
  );
}
