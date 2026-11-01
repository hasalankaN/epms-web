"use client";

import { Suspense } from "react";
import { PageSkeleton } from "@/components/common/PageSkeleton";
import { AdminAccountRequestsView } from "@/components/admin/AccountRequests/AdminAccountRequestsView";

export default function AdminAccountRequestsPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <AdminAccountRequestsView />
    </Suspense>
  );
}

