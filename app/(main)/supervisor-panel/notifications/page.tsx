"use client";

import React from "react";
import NotificationsList from "@/components/common/notifications/NotificationsList";
import { useMyNotificationsQuery } from "@/hooks/api/useNotifications";

export default function SupervisorNotificationsPage() {
  const { data: notifications = [] } = useMyNotificationsQuery();

  return (
    <NotificationsList
      initialNotifications={notifications}
      subtitle="Team tasks, leave requests, and performance alerts."
    />
  );
}
