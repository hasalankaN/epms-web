"use client";

import React, { Suspense } from "react";
import { EmployeeAttendanceView } from "@/components/employee/attendance/EmployeeAttendanceView";
import { PageSkeleton } from "@/components/common/PageSkeleton";

export default function EmployeeAttendancePage() {
  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          My Attendance & Timesheet
        </h1>
        <p className="text-xs text-slate-500">
          Monitor your biometric punch logs, daily shift hours, and request punch adjustments.
        </p>
      </div>

      <Suspense fallback={<PageSkeleton />}>
        <EmployeeAttendanceView />
      </Suspense>
    </div>
  );
}

