"use client";

import { Suspense } from "react";
import { PageSkeleton } from "@/components/common/PageSkeleton";
import { HrLeaveView } from "@/components/hr/leave/HrLeaveView";

export default function HrLeavePage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <HrLeaveView />
    </Suspense>
  );
}

