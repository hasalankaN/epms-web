"use client";

import { Suspense } from "react";
import { PageSkeleton } from "@/components/common/PageSkeleton";
import { HrAccountRequestsView } from "@/components/hr/accountRequests/HrAccountRequestsView";

export default function HrAccountRequestsPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <HrAccountRequestsView />
    </Suspense>
  );
}

