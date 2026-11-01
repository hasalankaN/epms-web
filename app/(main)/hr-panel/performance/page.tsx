"use client";

import { Suspense } from "react";
import { PageSkeleton } from "@/components/common/PageSkeleton";
import { HrPerformanceView } from "@/components/hr/performance/HrPerformanceView";

export default function HrPerformancePage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <HrPerformanceView />
    </Suspense>
  );
}

