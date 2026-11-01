"use client";

import React, { Suspense } from "react";
import { SupervisorTrainingView } from "@/components/supervisor/training/SupervisorTrainingView";
import { PageSkeleton } from "@/components/common/PageSkeleton";

export default function SupervisorTrainingPage() {
  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Team Training Program Attendance
        </h1>
        <p className="text-xs text-slate-500">
          Track course enrollments, verified session attendance, and post-session evaluation submissions across your direct reports.
        </p>
      </div>

      <Suspense fallback={<PageSkeleton />}>
        <SupervisorTrainingView />
      </Suspense>
    </div>
  );
}

