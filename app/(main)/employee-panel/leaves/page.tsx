"use client";

import React, { Suspense } from "react";
import { EmployeeLeaveView } from "@/components/employee/leaves/EmployeeLeaveView";
import { PageSkeleton } from "@/components/common/PageSkeleton";

export default function EmployeeLeavesPage() {
  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Leave Management
        </h1>
        <p className="text-xs text-slate-500">
          Track remaining statutory and company leave quotas, apply for leave, and view decision histories.
        </p>
      </div>

      <Suspense fallback={<PageSkeleton />}>
        <EmployeeLeaveView />
      </Suspense>
    </div>
  );
}

