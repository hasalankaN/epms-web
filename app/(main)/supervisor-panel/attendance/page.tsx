"use client";

import React, { Suspense } from "react";
import { SupervisorAttendanceView } from "@/components/supervisor/attendance/SupervisorAttendanceView";
import { PageSkeleton } from "@/components/common/PageSkeleton";

export default function SupervisorAttendancePage() {
  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Team Daily Attendance & Time Logs
        </h1>
        <p className="text-xs text-slate-500">
          Monitor your direct reports' daily shift biometric punches, review late check-ins, and perform authorized manual overrides.
        </p>
      </div>

      <Suspense fallback={<PageSkeleton />}>
        <SupervisorAttendanceView />
      </Suspense>
    </div>
  );
}

