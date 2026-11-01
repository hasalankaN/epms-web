"use client";

import React, { Suspense } from "react";
import { HrEmployeeDirectoryView } from "@/components/hr/employees/HrEmployeeDirectoryView";
import { PageSkeleton } from "@/components/common/PageSkeleton";

export default function HrEmployeesPage() {
  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Employee Master Directory
        </h1>
        <p className="text-xs text-slate-500">
          Comprehensive human resources registry. Onboard new staff, manage reporting hierarchies, assign positions, and control roles.
        </p>
      </div>

      <Suspense fallback={<PageSkeleton />}>
        <HrEmployeeDirectoryView />
      </Suspense>
    </div>
  );
}

