import React from "react";

import type { NotificationDataType } from "@/types/notifications";
import NotificationsList from "@/components/common/notifications/NotificationsList";

const MOCK_NOTIFICATIONS: NotificationDataType[] = [
  {
    id: "1",
    title: "Leave request pending",
    message: "Alice M. submitted a leave request for Nov 1–3 awaiting your review.",
    type: "leave",
    createdAt: "1 h ago",
    isRead: false,
  },
  {
    id: "2",
    title: "New hire onboarding",
    message: "David L. joined the Engineering team. Complete onboarding checklist.",
    type: "profile",
    createdAt: "Today",
    isRead: false,
  },
  {
    id: "3",
    title: "Payroll approval required",
    message: "October payroll is ready for your approval before processing.",
    type: "salary",
    createdAt: "Yesterday",
    isRead: true,
  },
  {
    id: "4",
    title: "Training session scheduled",
    message: "Leadership workshop has been added for Nov 10.",
    type: "training",
    createdAt: "Oct 14",
    isRead: true,
  },
];

export default function HrNotificationsPage() {
  return (
    <NotificationsList
      initialNotifications={MOCK_NOTIFICATIONS}
      subtitle="HR alerts, leave requests, payroll and onboarding updates."
    />
  );
}
