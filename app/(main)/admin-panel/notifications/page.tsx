"use client";

import React from "react";
import NotificationsList from "@/components/common/notifications/NotificationsList";
import { useAdminNotificationsQuery } from "@/hooks/api/useNotifications";

export default function AdminNotificationsPage() {
  const { data: notifications = [] } = useAdminNotificationsQuery();

  return (
    <NotificationsList
      initialNotifications={notifications}
      subtitle="Admin alerts, system events, and account activity."
    />
  );
}
