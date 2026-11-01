"use client";

import React, { Suspense } from "react";
import { EmployeeJobsView } from "@/components/employee/jobs/EmployeeJobsView";
import { PageSkeleton } from "@/components/common/PageSkeleton";

export default function EmployeeJobsPage() {
  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Internal Career Opportunities
        </h1>
        <p className="text-xs text-slate-500">
          Explore internal departmental vacancies, track your applications, and view interview dates.
        </p>
      </div>

      <Suspense fallback={<PageSkeleton />}>
        <EmployeeJobsView />
      </Suspense>
    </div>
  );
}
