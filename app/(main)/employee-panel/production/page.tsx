"use client";

import React, { Suspense } from "react";
import { EmployeeProductionView } from "@/components/employee/production/EmployeeProductionView";
import { PageSkeleton } from "@/components/common/PageSkeleton";

export default function EmployeeProductionPage() {
  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Production & Output Tracking
        </h1>
        <p className="text-xs text-slate-500">
          Review your daily task output, target achievement ratios, and supervisor feedback comments.
        </p>
      </div>

      <Suspense fallback={<PageSkeleton />}>
        <EmployeeProductionView />
      </Suspense>
    </div>
  );
}
