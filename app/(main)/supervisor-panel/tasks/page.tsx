"use client";

import React, { Suspense } from "react";
import { SupervisorTasksView } from "@/components/supervisor/tasks/SupervisorTasksView";
import { PageSkeleton } from "@/components/common/PageSkeleton";

export default function SupervisorTasksPage() {
  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Team Task Allocations & Sprint Deliverables
        </h1>
        <p className="text-xs text-slate-500">
          Assign deliverables to team members, set priority levels, monitor progress, and manage deadlines.
        </p>
      </div>

      <Suspense fallback={<PageSkeleton />}>
        <SupervisorTasksView />
      </Suspense>
    </div>
  );
}

