"use client";

import React from "react";
import NotificationsList from "@/components/common/notifications/NotificationsList";
import { useMyNotificationsQuery } from "@/hooks/api/useNotifications";

export default function EmployeeNotificationsPage() {
  const { data: notifications = [], isLoading } = useMyNotificationsQuery();

  return (
    <NotificationsList
      initialNotifications={notifications}
      subtitle="Updates about leave, tasks, training and pay."
    />
  );
}
