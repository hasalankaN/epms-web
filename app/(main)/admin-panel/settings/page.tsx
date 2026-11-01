"use client";

import { Suspense } from "react";
import { PageSkeleton } from "@/components/common/PageSkeleton";
import { AdminSettingsView } from "@/components/admin/Settings/AdminSettingsView";

export default function AdminSettingsPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <AdminSettingsView />
    </Suspense>
  );
}

