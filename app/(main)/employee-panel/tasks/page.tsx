"use client";

import React, { Suspense } from "react";
import { EmployeeTasksView } from "@/components/employee/tasks/EmployeeTasksView";
import { PageSkeleton } from "@/components/common/PageSkeleton";

export default function EmployeeTasksPage() {
  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          My Task Board
        </h1>
        <p className="text-xs text-slate-500">
          Track deliverables, sprint tasks assigned to you, and update status progress.
        </p>
      </div>

      <Suspense fallback={<PageSkeleton />}>
        <EmployeeTasksView />
      </Suspense>
    </div>
  );
}
