"use client";

import React, { Suspense } from "react";
import { EmployeePerformanceView } from "@/components/employee/performance/EmployeePerformanceView";
import { PageSkeleton } from "@/components/common/PageSkeleton";

export default function EmployeePerformancePage() {
  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Self Appraisal & Performance Reviews
        </h1>
        <p className="text-xs text-slate-500">
          Complete quarterly self-evaluations, rate your criteria competencies, and review historical supervisor appraisal feedback.
        </p>
      </div>

      <Suspense fallback={<PageSkeleton />}>
        <EmployeePerformanceView />
      </Suspense>
    </div>
  );
}
