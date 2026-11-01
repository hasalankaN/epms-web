"use client";

import { Suspense } from "react";
import { PageSkeleton } from "@/components/common/PageSkeleton";
import { HrReportsView } from "@/components/hr/reports/HrReportsView";

export default function HrReportsPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <HrReportsView />
    </Suspense>
  );
}

