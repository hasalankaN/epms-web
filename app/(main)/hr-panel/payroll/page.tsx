"use client";

import { Suspense } from "react";
import { PageSkeleton } from "@/components/common/PageSkeleton";
import { HrPayrollView } from "@/components/hr/payroll/HrPayrollView";

export default function HrPayrollPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <HrPayrollView />
    </Suspense>
  );
}

