"use client";

import React from "react";
import NotificationsList from "@/components/common/notifications/NotificationsList";
import { useHrNotificationsQuery } from "@/hooks/api/useNotifications";

export default function HrNotificationsPage() {
  const { data: notifications = [] } = useHrNotificationsQuery();

  return (
    <NotificationsList
      initialNotifications={notifications}
      subtitle="HR alerts, leave requests, payroll and onboarding updates."
    />
  );
}
